import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const subscriptionSchema = new mongoose.Schema(
  {
    planType: { 
      type: String, 
      enum: ["workout", "nutrition"], 
      required: true 
    }, // Type of plan
    plan: { type: ObjectId, refPath: "planType", required: true }, // Reference to WorkoutPlan or NutritionPlan
    user: { type: ObjectId, ref: "User", required: true }, // The subscriber
    trainer: { type: ObjectId, ref: "User", required: true }, // The creator/trainer
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "active", "cancelled"],
      default: "pending",
    },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;