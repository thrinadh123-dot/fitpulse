import mongoose from "mongoose";

const nutritionPlanSchema = new mongoose.Schema(
  {
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    durationWeeks: { type: Number, required: true },
    category: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const NutritionPlan = mongoose.model("NutritionPlan", nutritionPlanSchema);

export default NutritionPlan;
