
// import express from "express";
// import { protect } from "../middleware/auth.js";
// import { addWorkoutPlan, changeRoleToTrainer } from "../controllers/userController.js";
// import upload from "../middleware/multer.js";

// const ownerRouter = express.Router();

// // Route to change role (User → Trainer)
// ownerRouter.post("/change-role", protect, changeRoleToTrainer);

// // Route to add a workout plan
// ownerRouter.post("/add-plan", upload.single("image"), protect, addWorkoutPlan);

// export default ownerRouter;

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

export default trainerRouter;