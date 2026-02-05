import express from "express";
import { 
    createSubscription, 
    getUserSubscriptions, 
    getTrainerSubscriptions, 
    changeSubscriptionStatus 
} from "../controllers/subscriptionController.js";
import { protect } from "../middleware/auth.js";

const subscriptionRouter = express.Router();

// Subscribe to a plan
subscriptionRouter.post("/create", protect, createSubscription);

// List subscriptions of logged-in user
subscriptionRouter.get("/user", protect, getUserSubscriptions);

// List subscriptions of logged-in trainer
subscriptionRouter.get("/trainer", protect, getTrainerSubscriptions);

// Change subscription status (Trainer can cancel)
subscriptionRouter.post("/change-status", protect, changeSubscriptionStatus);

export default subscriptionRouter;