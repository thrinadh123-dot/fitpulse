import express from 'express';
import { UserDailyStats, UserStatsHistory, UserGoals } from '../models/dailyStats.js';

const router = express.Router();

/**
 * Get user's current daily stats
 * GET /api/fitness/daily/:userId
 */
router.get('/daily/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find or create today's stats
    const stats = await UserDailyStats.findOrCreateToday(userId);
    
    res.json({
      success: true,
      data: {
        calories: stats.calories,
        water: stats.water,
        steps: stats.steps,
        sleep: stats.sleep,
        lastUpdated: stats.lastUpdated,
        date: stats.date
      }
    });
  } catch (error) {
    console.error('Error fetching daily stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch daily stats',
      error: error.message
    });
  }
});

/**
 * Update user's daily stats
 * PUT /api/fitness/daily/:userId
 */
router.put('/daily/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { calories, water, steps, sleep } = req.body;
    
    const stats = await UserDailyStats.findOrCreateToday(userId);
    
    // Update provided fields
    if (calories !== undefined) stats.calories = Math.max(0, calories);
    if (water !== undefined) stats.water = Math.max(0, water);
    if (steps !== undefined) stats.steps = Math.max(0, steps);
    if (sleep !== undefined) stats.sleep = Math.max(0, Math.min(24, sleep));
    
    stats.lastUpdated = new Date();
    await stats.save();
    
    res.json({
      success: true,
      message: 'Daily stats updated successfully',
      data: {
        calories: stats.calories,
        water: stats.water,
        steps: stats.steps,
        sleep: stats.sleep,
        lastUpdated: stats.lastUpdated
      }
    });
  } catch (error) {
    console.error('Error updating daily stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update daily stats',
      error: error.message
    });
  }
});

/**
 * Add to user's daily stats (increment)
 * POST /api/fitness/daily/:userId/add
 */
router.post('/daily/:userId/add', async (req, res) => {
  try {
    const { userId } = req.params;
    const { calories, water, steps, sleep } = req.body;
    
    const stats = await UserDailyStats.findOrCreateToday(userId);
    
    // Add to existing values
    if (calories && calories > 0) stats.calories += calories;
    if (water && water > 0) stats.water += water;
    if (steps && steps > 0) stats.steps += steps;
    if (sleep && sleep > 0) stats.sleep = Math.min(24, stats.sleep + sleep);
    
    stats.lastUpdated = new Date();
    await stats.save();
    
    res.json({
      success: true,
      message: 'Values added to daily stats',
      data: {
        calories: stats.calories,
        water: stats.water,
        steps: stats.steps,
        sleep: stats.sleep,
        lastUpdated: stats.lastUpdated
      }
    });
  } catch (error) {
    console.error('Error adding to daily stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add to daily stats',
      error: error.message
    });
  }
});

/**
 * Get user's goals
 * GET /api/fitness/goals/:userId
 */
router.get('/goals/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    let goals = await UserGoals.findOne({ userId });
    
    if (!goals) {
      // Create default goals
      goals = await UserGoals.create({
        userId,
        calories: 2000,
        water: 8,
        steps: 10000,
        sleep: 8
      });
    }
    
    res.json({
      success: true,
      data: {
        calories: goals.calories,
        water: goals.water,
        steps: goals.steps,
        sleep: goals.sleep
      }
    });
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch goals',
      error: error.message
    });
  }
});

/**
 * Update user's goals
 * PUT /api/fitness/goals/:userId
 */
router.put('/goals/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { calories, water, steps, sleep } = req.body;
    
    const goals = await UserGoals.findOneAndUpdate(
      { userId },
      {
        ...(calories && { calories: Math.max(0, calories) }),
        ...(water && { water: Math.max(0, water) }),
        ...(steps && { steps: Math.max(0, steps) }),
        ...(sleep && { sleep: Math.max(0, Math.min(24, sleep)) })
      },
      { new: true, upsert: true }
    );
    
    res.json({
      success: true,
      message: 'Goals updated successfully',
      data: {
        calories: goals.calories,
        water: goals.water,
        steps: goals.steps,
        sleep: goals.sleep
      }
    });
  } catch (error) {
    console.error('Error updating goals:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update goals',
      error: error.message
    });
  }
});

/**
 * Get user's historical stats
 * GET /api/fitness/history/:userId
 */
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 30, page = 1 } = req.query;
    
    const skip = (page - 1) * limit;
    
    const history = await UserStatsHistory.find({ userId })
      .sort({ originalDate: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await UserStatsHistory.countDocuments({ userId });
    
    res.json({
      success: true,
      data: history,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch history',
      error: error.message
    });
  }
});

export default router;