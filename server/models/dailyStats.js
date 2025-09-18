import mongoose from 'mongoose';

// User Daily Stats Schema - matches frontend FitnessData structure
const userDailyStatsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  // Core fitness metrics
  calories: {
    type: Number,
    default: 0,
    min: 0
  },
  water: {
    type: Number,
    default: 0,
    min: 0
  },
  steps: {
    type: Number,
    default: 0,
    min: 0
  },
  sleep: {
    type: Number,
    default: 0,
    min: 0,
    max: 24
  },
  // Additional tracking fields
  timezone: {
    type: String,
    default: 'UTC'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  lastReset: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  // Ensure one record per user per day
  indexes: [
    { userId: 1, date: 1 },
    { lastReset: 1 }
  ]
});

// Create compound index for unique user-date combination
userDailyStatsSchema.index({ userId: 1, date: 1 }, { unique: true });

// User Stats History Schema - for archiving daily data
const userStatsHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalDate: {
    type: Date,
    required: true
  },
  calories: {
    type: Number,
    default: 0
  },
  water: {
    type: Number,
    default: 0
  },
  steps: {
    type: Number,
    default: 0
  },
  sleep: {
    type: Number,
    default: 0
  },
  archivedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  indexes: [
    { userId: 1, originalDate: -1 },
    { archivedAt: -1 }
  ]
});

// User Goals Schema - matches frontend DEFAULT_GOALS
const userGoalsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  calories: {
    type: Number,
    default: 2000
  },
  water: {
    type: Number,
    default: 8
  },
  steps: {
    type: Number,
    default: 10000
  },
  sleep: {
    type: Number,
    default: 8
  }
}, {
  timestamps: true
});

// Static methods for UserDailyStats
userDailyStatsSchema.statics.findOrCreateToday = async function(userId, timezone = 'UTC') {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let stats = await this.findOne({
    userId,
    date: {
      $gte: today,
      $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
    }
  });

  if (!stats) {
    stats = await this.create({
      userId,
      date: today,
      timezone,
      calories: 0,
      water: 0,
      steps: 0,
      sleep: 0
    });
  }

  return stats;
};

userDailyStatsSchema.statics.getUsersForReset = async function() {
  const twentyThreeHoursAgo = new Date(Date.now() - 23 * 60 * 60 * 1000);
  
  return this.find({
    $or: [
      { lastReset: { $lt: twentyThreeHoursAgo } },
      { lastReset: null }
    ]
  }).populate('userId', 'timezone');
};

// Instance methods
userDailyStatsSchema.methods.needsReset = function(timezone = 'UTC') {
  if (!this.lastReset) return true;
  
  const now = new Date();
  const userLocalTime = new Date().toLocaleString('en-US', { timeZone: timezone });
  const userDate = new Date(userLocalTime);
  const lastResetDate = new Date(this.lastReset);
  
  // Check if it's a new day in user's timezone
  const nowDay = userDate.toDateString();
  const resetDay = lastResetDate.toDateString();
  
  return nowDay !== resetDay;
};

userDailyStatsSchema.methods.archiveAndReset = async function() {
  const UserStatsHistory = mongoose.model('UserStatsHistory');
  
  // Archive current stats
  await UserStatsHistory.create({
    userId: this.userId,
    originalDate: this.date,
    calories: this.calories,
    water: this.water,
    steps: this.steps,
    sleep: this.sleep
  });
  
  // Reset current stats
  this.calories = 0;
  this.water = 0;
  this.steps = 0;
  this.sleep = 0;
  this.date = new Date();
  this.lastReset = new Date();
  this.lastUpdated = new Date();
  
  return this.save();
};

// Export models
export const UserDailyStats = mongoose.model('UserDailyStats', userDailyStatsSchema);
export const UserStatsHistory = mongoose.model('UserStatsHistory', userStatsHistorySchema);
export const UserGoals = mongoose.model('UserGoals', userGoalsSchema);