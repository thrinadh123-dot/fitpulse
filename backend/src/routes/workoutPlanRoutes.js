import express from "express";
import { addWorkoutPlan } from "../controllers/ownerController.js";
import { protect } from "../middleware/auth.js";
import multer from "multer";

const upload = multer({ dest: 'uploads/' });

const workoutPlanRouter = express.Router();

workoutPlanRouter.post("/add", protect, upload.single('image'), addWorkoutPlan);

export default workoutPlanRouter;
