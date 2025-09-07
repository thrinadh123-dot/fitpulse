import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    planType: { type: String, enum: ["workout", "nutrition"], required: true },
    plan: { type: mongoose.Schema.Types.ObjectId, refPath: "planType", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ["active", "cancelled", "expired", "pending"], default: "pending" },
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
