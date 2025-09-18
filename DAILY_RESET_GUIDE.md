# Daily Data Reset System - Implementation Guide

## 📋 Overview

This system provides automated daily reset functionality for user fitness data at midnight in their local timezone. It includes data archiving, timezone handling, and admin controls.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd server
npm install node-cron
```

### 2. Start the Server
```bash
# Development mode with auto-reload
npm run server

# Or production mode
npm start
```

### 3. Verify Installation
The daily reset scheduler will automatically start when the server starts. Check console for:
```
🚀 Starting daily reset scheduler...
✅ Daily reset scheduler initialized
```

## 🕐 Cron Schedule Details

### Current Configuration
- **Schedule**: `0 * * * *` (every hour at minute 0)
- **Purpose**: Check for users whose local time has passed midnight
- **Timezone Handling**: Each user reset happens at their local midnight

### Why Hourly?
Running every hour ensures users across all timezones get reset precisely at their local midnight, rather than all at once at server midnight.

## 📊 Database Schema

### UserDailyStats Collection
```javascript
{
  userId: ObjectId,           // Reference to User
  date: Date,                 // Current date
  calories: Number,           // Daily calories (starts at 0)
  water: Number,              // Cups of water (starts at 0) 
  steps: Number,              // Daily steps (starts at 0)
  sleep: Number,              // Hours of sleep (starts at 0)
  timezone: String,           // User's timezone (default: 'UTC')
  lastUpdated: Date,          // Last modification time
  lastReset: Date             // Last reset timestamp
}
```

### UserStatsHistory Collection
```javascript
{
  userId: ObjectId,           // Reference to User
  originalDate: Date,         // Original date of the archived data
  calories: Number,           // Final calories for the day
  water: Number,              // Final water intake
  steps: Number,              // Final step count
  sleep: Number,              // Final sleep hours
  archivedAt: Date            // When data was archived
}
```

## 🌍 Timezone Handling Strategy

### How It Works
1. **Hourly Check**: Every hour, scan all users for potential resets
2. **Local Time Calculation**: For each user, calculate their current local time
3. **Day Comparison**: Check if it's a new day since their last reset
4. **Individual Reset**: Reset only users whose local midnight has passed

### Example Scenarios
- **User in NYC (EST)**: Reset at 5:00 AM UTC (midnight EST)
- **User in Tokyo (JST)**: Reset at 3:00 PM UTC (midnight JST)
- **User in London (GMT)**: Reset at 12:00 AM UTC (midnight GMT)

## 🔧 API Endpoints

### Admin Endpoints
```bash
# Manual reset all users
POST /api/admin/reset/all

# Manual reset specific user
POST /api/admin/reset/user/:userId

# Get reset statistics
GET /api/admin/reset/stats

# Health check
GET /api/admin/reset/health
```

### Fitness Data Endpoints
```bash
# Get user's current daily stats
GET /api/fitness/daily/:userId

# Update daily stats (set values)
PUT /api/fitness/daily/:userId
# Body: { calories: 500, water: 3, steps: 5000, sleep: 7 }

# Add to daily stats (increment values)
POST /api/fitness/daily/:userId/add
# Body: { calories: 300, water: 1, steps: 1000 }

# Get/Set user goals
GET /api/fitness/goals/:userId
PUT /api/fitness/goals/:userId

# Get historical data
GET /api/fitness/history/:userId?limit=30&page=1
```

## 🧪 Testing the Reset System

### 1. Manual Testing
```bash
# Trigger immediate reset for all users
curl -X POST http://localhost:3000/api/admin/reset/all

# Reset specific user
curl -X POST http://localhost:3000/api/admin/reset/user/USER_ID

# Check reset statistics
curl http://localhost:3000/api/admin/reset/stats
```

### 2. Development Mode
In development mode, the system runs an initial reset check 5 seconds after startup for testing.

### 3. Verify Data
```bash
# Check user's current stats
curl http://localhost:3000/api/fitness/daily/USER_ID

# Check archived history
curl http://localhost:3000/api/fitness/history/USER_ID
```

## 📈 Integration with Frontend

### Option 1: Replace localStorage with API
Update your `useFitnessStore.tsx` to call the backend API instead of localStorage:

```typescript
// Instead of localStorage, call API
const loadData = async (userId: string) => {
  const response = await fetch(`/api/fitness/daily/${userId}`);
  const result = await response.json();
  return result.data;
};

const saveData = async (userId: string, data: FitnessData) => {
  await fetch(`/api/fitness/daily/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
};
```

### Option 2: Hybrid Approach
Keep localStorage for immediate UI updates, sync with backend periodically:

```typescript
// Sync with backend every 5 minutes
useEffect(() => {
  const interval = setInterval(async () => {
    const localData = loadData();
    await syncWithBackend(userId, localData);
  }, 5 * 60 * 1000);
  
  return () => clearInterval(interval);
}, []);
```

## ⚡ Performance Considerations

### Database Optimization
- **Indexes**: Created on `userId + date` and `lastReset` fields
- **Batch Processing**: Processes users in chunks to avoid memory issues
- **Query Efficiency**: Uses MongoDB aggregation for complex timezone queries

### Scalability
- **Horizontal Scaling**: Each server instance runs its own scheduler
- **Lock Prevention**: Uses `isRunning` flag to prevent concurrent resets
- **Error Handling**: Individual user failures don't stop the entire process

## 🚨 Important Notes

### Security
- **Admin Endpoints**: Add authentication middleware in production
- **Rate Limiting**: Implement rate limiting on manual reset endpoints
- **Input Validation**: Validate all user inputs and sanitize data

### Data Safety
- **Archival First**: Always archives data before resetting
- **Atomic Operations**: Uses MongoDB transactions where needed
- **Rollback Capability**: Historical data allows for data recovery

### Monitoring
- **Logging**: Comprehensive logging for all reset operations
- **Metrics**: Track success/failure rates via `/api/admin/reset/stats`
- **Alerts**: Set up monitoring for failed resets

## 🔄 Migration from Frontend-Only

If you want to migrate existing localStorage data to the backend:

1. **Create Migration Script**: Export localStorage data
2. **Bulk Import**: Use admin endpoint to import historical data
3. **Gradual Transition**: Use hybrid approach during transition
4. **Verification**: Compare frontend/backend data for consistency

## 📞 Support & Troubleshooting

### Common Issues
1. **Timezone Problems**: Check user's timezone is correctly set
2. **Duplicate Resets**: Verify `lastReset` timestamps are updating
3. **Missing Archives**: Check UserStatsHistory collection for archived data
4. **Performance Issues**: Monitor database query performance

### Debug Commands
```bash
# Check if scheduler is running
curl http://localhost:3000/api/admin/reset/health

# View recent activity
tail -f server.log | grep \"Daily reset\"

# Database queries
# Check users needing reset
db.userdailystats.find({ lastReset: { $lt: new Date(Date.now() - 23*60*60*1000) }})
```

The system is now ready for production use! 🎉