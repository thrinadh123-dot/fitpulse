import Subscription from "../models/Subscription.js";
import WorkoutPlan from "../models/WorkoutPlan.js";
import NutritionPlan from "../models/NutritionPlan.js";

// API to Create Subscription
export const createSubscription = async (req, res) => {
  try {
    const { _id } = req.user;
    const { planType, planId, startDate, endDate } = req.body;

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

// API to Change Subscription Status (Trainer can cancel)
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
    res.json({ success: false, message: error.message });
  }
};

// Trainer Dashboard Data
export const getTrainerDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;

    if (role !== "trainer") {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const plans = await WorkoutPlan.find({ trainer: _id });
    const subscriptions = await Subscription.find({ trainer: _id }).populate("plan").sort({ createdAt: -1 });

    const pendingSubscriptions = await Subscription.find({ trainer: _id, status: "pending" });
    const activeSubscriptions = await Subscription.find({ trainer: _id, status: "active" });

    // Calculate monthlyRevenue from active subscriptions
    const monthlyRevenue = activeSubscriptions.reduce((acc, sub) => acc + sub.price, 0);

    const dashboardData = {
      totalPlans: plans.length,
      totalSubscriptions: subscriptions.length,
      pendingSubscriptions: pendingSubscriptions.length,
      activeSubscriptions: activeSubscriptions.length,
      monthlyRevenue,
    };

    res.json({ success: true, dashboardData });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
