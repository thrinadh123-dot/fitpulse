import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const workoutPlanSchema = new mongoose.Schema(
  {
    trainer: { type: ObjectId, ref: "User" }, // Who created the plan
    title: { type: String, required: true }, // Plan name
    image: { type: String, required: true }, // Thumbnail/cover image
    durationWeeks: { type: Number, required: true }, // e.g. 4 weeks, 8 weeks
    category: { type: String, required: true }, // e.g. Strength, Cardio, Weight Loss
    difficulty: { type: String, required: true }, // Beginner, Intermediate, Advanced
    equipmentNeeded: { type: String, required: true }, // e.g. Dumbbells, Bodyweight, Full Gym
    price: { type: Number, required: true }, // Price for premium plans
    description: { type: String, required: true }, // Overview of the plan
    isActive: { type: Boolean, default: true }, // Whether available to users
  },
  { timestamps: true }
);

const WorkoutPlan = mongoose.model("WorkoutPlan", workoutPlanSchema);

export default WorkoutPlan;