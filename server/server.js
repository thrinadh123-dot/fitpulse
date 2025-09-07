import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import workoutPlanRouter from "./routes/workoutPlanRoutes.js";
import subscriptionRouter from "./routes/subscriptionRoutes.js";


// initialize express app
const app = express();

//connect database
await  connectDB()
// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// default route
app.get("/", (req, res) => res.send("Server is running"));
app.use('/api/user',userRouter)
app.use('/api/workout-plans', workoutPlanRouter);
app.use('/api/subscriptions', subscriptionRouter);

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));