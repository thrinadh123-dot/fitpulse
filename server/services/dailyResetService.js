import cron from 'node-cron';
import mongoose from 'mongoose';
import { UserDailyStats, UserStatsHistory, UserGoals } from '../models/dailyStats.js';

// Database connection (adjust based on your database type)
const dbConfig = {
  // MongoDB configuration
  connectionString: process.env.MONGODB_URI || 'mongodb://localhost:27017/fitpulse'
};

class DailyResetService {
  constructor() {
    this.isRunning = false;
  }

  /**
   * Archive user's daily stats before reset
   * @param {Object} userStats - User's current daily stats
   */
  async archiveDailyStats(userStats) {
    try {
      // Use the model's built-in archiving method
      await userStats.archiveAndReset();
      console.log(`✅ Archived and reset stats for user ${userStats.userId}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to archive stats for user ${userStats.userId}:`, error);
      return false;
    }
  }

  /**
   * Reset daily stats for a specific user
   * @param {string} userId - User ID to reset
   */
  async resetUserDailyStats(userId) {
    try {
      const stats = await UserDailyStats.findOrCreateToday(userId);
      await stats.archiveAndReset();
      console.log(`✅ Reset daily stats for user ${userId}`);
      return stats;
    } catch (error) {
      console.error(`❌ Failed to reset stats for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get users whose local time has passed midnight since last reset
   */
  async getUsersForReset() {
    try {
      // Use the model's static method to get users needing reset
      const users = await UserDailyStats.getUsersForReset();
      
      const usersToReset = [];
      
      for (const user of users) {
        const timezone = user.userId?.timezone || user.timezone || 'UTC';
        
        if (user.needsReset(timezone)) {
          usersToReset.push(user);
        }
      }
      
      return usersToReset;
    } catch (error) {
      console.error('❌ Error getting users for reset:', error);
      return [];
    }
  }

  /**
   * Main reset process
   */
  async performDailyReset() {
    if (this.isRunning) {
      console.log('⚠️ Daily reset already in progress, skipping...');
      return;
    }

    this.isRunning = true;
    console.log('🔄 Starting daily reset process...');

    try {
      const usersToReset = await this.getUsersForReset();
      console.log(`📊 Found ${usersToReset.length} users requiring reset`);

      let successCount = 0;
      let errorCount = 0;

      for (const userStats of usersToReset) {
        try {
          // Archive and reset in one operation
          await this.archiveDailyStats(userStats);
          successCount++;
        } catch (error) {
          console.error(`❌ Error processing user ${userStats.userId}:`, error);
          errorCount++;
        }
      }

      console.log(`✅ Daily reset completed: ${successCount} successful, ${errorCount} errors`);
    } catch (error) {
      console.error('❌ Critical error during daily reset:', error);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Initialize the cron job
   */
  startScheduler() {
    console.log('🚀 Starting daily reset scheduler...');
    
    // Run every hour to check for users needing reset
    cron.schedule('0 * * * *', async () => {
      console.log('⏰ Hourly reset check triggered');
      await this.performDailyReset();
    });

    // Optional: Run immediately at server startup for testing
    if (process.env.NODE_ENV === 'development') {
      console.log('🧪 Development mode: Running initial reset check');
      setTimeout(() => this.performDailyReset(), 5000);
    }

    console.log('✅ Daily reset scheduler initialized');
  }

  /**
   * Manual reset trigger (for testing/admin purposes)
   */
  async manualReset(userId = null) {
    console.log('🔧 Manual reset triggered');
    
    if (userId) {
      // Reset specific user
      try {
        await this.resetUserDailyStats(userId);
        console.log(`✅ Manual reset completed for user ${userId}`);
      } catch (error) {
        console.log(`❌ User ${userId} reset failed:`, error.message);
        throw error;
      }
    } else {
      // Reset all users (use with caution)
      await this.performDailyReset();
    }
  }

  /**
   * Get reset statistics
   */
  async getResetStatistics() {
    try {
      const totalUsers = await UserDailyStats.countDocuments();
      const recentResets = await UserDailyStats.countDocuments({
        lastReset: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      });
      const archivedEntries = await UserStatsHistory.countDocuments({
        archivedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      });

      return {
        totalUsers,
        recentResets,
        archivedEntries,
        lastCheckTime: new Date()
      };
    } catch (error) {
      console.error('❌ Error getting reset statistics:', error);
      return null;
    }
  }
}

export default DailyResetService;