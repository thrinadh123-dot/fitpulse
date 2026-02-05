import express from 'express';
import DailyResetService from '../services/dailyResetService.js';

const router = express.Router();
const resetService = new DailyResetService();

// Initialize the daily reset scheduler when the server starts
resetService.startScheduler();

/**
 * Admin endpoint to manually trigger reset for all users
 * POST /api/admin/reset/all
 */
router.post('/reset/all', async (req, res) => {
  try {
    // Add authentication middleware here in production
    console.log('🔧 Manual reset triggered by admin');
    await resetService.manualReset();
    
    res.json({
      success: true,
      message: 'Manual reset completed successfully',
      timestamp: new Date()
    });
  } catch (error) {
    console.error('❌ Manual reset failed:', error);
    res.status(500).json({
      success: false,
      message: 'Reset failed',
      error: error.message
    });
  }
});

/**
 * Admin endpoint to manually reset specific user
 * POST /api/admin/reset/user/:userId
 */
router.post('/reset/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`🔧 Manual reset triggered for user ${userId}`);
    await resetService.manualReset(userId);
    
    res.json({
      success: true,
      message: `Reset completed for user ${userId}`,
      userId,
      timestamp: new Date()
    });
  } catch (error) {
    console.error(`❌ Manual reset failed for user ${req.params.userId}:`, error);
    res.status(500).json({
      success: false,
      message: 'User reset failed',
      error: error.message
    });
  }
});

/**
 * Get reset statistics
 * GET /api/admin/reset/stats
 */
router.get('/reset/stats', async (req, res) => {
  try {
    const stats = await resetService.getResetStatistics();
    
    if (stats) {
      res.json({
        success: true,
        data: stats
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve statistics'
      });
    }
  } catch (error) {
    console.error('❌ Error getting reset stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get statistics',
      error: error.message
    });
  }
});

/**
 * Health check for reset service
 * GET /api/admin/reset/health
 */
router.get('/reset/health', (req, res) => {
  res.json({
    success: true,
    message: 'Daily reset service is running',
    isRunning: !resetService.isRunning,
    timestamp: new Date()
  });
});

export default router;