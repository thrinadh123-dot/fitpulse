import express from "express";
import { protect } from "../middleware/auth.js";
import { 
    addWorkoutPlan, 
    changeRoleToTrainer, 
    deleteWorkoutPlan, 
    getTrainerWorkoutPlans, 
    toggleWorkoutPlanAvailability 
} from "../controllers/trainerController.js";
import upload from "../middleware/multer.js";
import { getdashboardData, updateUserImage } from "../controllers/ownerController.js";

const trainerRouter = express.Router();

// Change role from user → trainer
trainerRouter.post("/change-role", protect, changeRoleToTrainer);

// Add a workout plan
trainerRouter.post("/add-plan", upload.single("image"), protect, addWorkoutPlan);

// Get all workout plans of the trainer
trainerRouter.get("/plans", protect, getTrainerWorkoutPlans);

// Toggle workout plan availability
trainerRouter.post("/toggle-plan", protect, toggleWorkoutPlanAvailability);

// Delete a workout plan
trainerRouter.post("/delete-plan", protect, deleteWorkoutPlan);

ownerRouter.post('/update-image', upload.single("image"), protect, updateUserImage);

const ownerRouter = express.Router();

ownerRouter.get('/dashboard', protect, getdashboardData);

export default trainerRouter;