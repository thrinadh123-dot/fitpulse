import Subscription from "../models/Subscription.js";
import WorkoutPlan from "../models/WorkoutPlan.js";
import NutritionPlan from "../models/NutritionPlan.js";

// API to Create Subscription
export const createSubscription = async (req, res) => {
  try {
    const { _id } = req.user; // logged-in user
    const { planType, planId, startDate, endDate } = req.body;

    // Fetch plan
    let planData;
    if (planType === "workout") planData = await WorkoutPlan.findById(planId);
    else if (planType === "nutrition") planData = await NutritionPlan.findById(planId);
    else return res.json({ success: false, message: "Invalid plan type" });

    if (!planData || !planData.isActive) {
      return res.json({ success: false, message: `${planType} plan is not available` });
    }

    await Subscription.create({
      planType,
      plan: planId,
      user: _id,
      trainer: planData.trainer,
      startDate,
      endDate,
      price: planData.price,
      status: "active",
    });

    res.json({ success: true, message: "Subscription Created" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to List User Subscriptions
export const getUserSubscriptions = async (req, res) => {
  try {
    const { _id } = req.user;
    const subscriptions = await Subscription.find({ user: _id })
      .populate("plan")
      .populate("trainer", "-password")
      .sort({ createdAt: -1 });

    res.json({ success: true, subscriptions });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to List Trainer Subscriptions
export const getTrainerSubscriptions = async (req, res) => {
  try {
    if (req.user.role !== "trainer") {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const subscriptions = await Subscription.find({ trainer: req.user._id })
      .populate("plan user", "-password")
      .sort({ createdAt: -1 });

    res.json({ success: true, subscriptions });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to Change Subscription Status (Trainer can mark cancelled)
export const changeSubscriptionStatus = async (req, res) => {
  try {
    const { _id } = req.user;
    const { subscriptionId, status } = req.body;

    const subscription = await Subscription.findById(subscriptionId);

    if (subscription.trainer.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    subscription.status = status;
    await subscription.save();

    res.json({ success: true, message: "Subscription status changed" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};