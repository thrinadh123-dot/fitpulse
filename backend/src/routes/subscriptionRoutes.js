import express from "express";
import {
  createSubscription,
  getUserSubscriptions,
  getTrainerSubscriptions,
  changeSubscriptionStatus,
  getTrainerDashboardData,
} from "../controllers/subscriptionController.js";
import { protect } from "../middleware/auth.js";

const subscriptionRouter = express.Router();

subscriptionRouter.post("/create", protect, createSubscription);
subscriptionRouter.get("/user", protect, getUserSubscriptions);
subscriptionRouter.get("/trainer", protect, getTrainerSubscriptions);
subscriptionRouter.put("/status", protect, changeSubscriptionStatus);
subscriptionRouter.get("/trainer/dashboard", protect, getTrainerDashboardData);

export default subscriptionRouter;
