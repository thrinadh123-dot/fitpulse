
import { Dumbbell, BrainCircuit, LineChart, ShieldCheck, ArrowRight } from "lucide-react";
import React from "react";

export const features = [
  {
    icon: <Dumbbell className="h-8 w-8 text-[#4A8BDF]" />,
    title: "Smart Workout Tracker",
    description: "Track sets, reps, and progression with intelligent, real-time feedback.",
  },
  {
    icon: <BrainCircuit className="h-8 w-8 text-[#FF5841]" />,
    title: "AI-Powered Nutrition",
    description: "Get personalized meal plans and nutritional guidance based on your goals.",
  },
  {
    icon: <LineChart className="h-8 w-8 text-[#4A8BDF]" />,
    title: "Progress Dashboard",
    description: "Visualize your health improvements with beautiful, easy-to-read charts.",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-[#C53678]" />,
    title: "Wellness & Hydration",
    description: "Log water intake and get reminders to stay hydrated and healthy.",
  },
  {
    icon: <ArrowRight className="h-8 w-8 text-[#A0006D]" />,
    title: "Gamified Streaks",
    description: "Earn XP, unlock achievements, and maintain streaks for staying consistent.",
  },
  {
    icon: <LineChart className="h-8 w-8 text-[#4A8BDF]" />,
    title: "Health Timeline",
    description: "Scroll through your fitness journey — from workouts to sleep and meals.",
  },
];

export const testimonials = [
    {
      name: "Dr. Elena Vance",
      role: "Sports Physician",
      quote: "FitPulse's precision in tracking and analytics is unparalleled. It's a game-changer for both my clients and my own training regimen.",
    },
    {
      name: "Marcus Cole",
      role: "Professional Athlete",
      quote: "The AI nutrition guide adapted to my competition schedule perfectly. I've never felt more prepared and in tune with my body.",
    },
    {
      name: "Sophie Chen",
      role: "Certified Nutritionist",
      quote: "I recommend FitPulse to all my clients. The progress dashboard makes it incredibly easy to monitor their journey and make informed decisions.",
    },
  ];
  
  export const pricingPlans = [
    {
      name: "Starter",
      price: "₹999",
      features: ["Smart Workout Tracker", "Basic Nutrition Guide", "Progress Dashboard"],
      cta: "Start Free Trial",
      color: "#4A8BDF",
    },
    {
      name: "Pro",
      price: "₹1999",
      features: ["All Starter Features", "AI-Powered Nutrition", "Advanced Analytics", "Priority Support"],
      cta: "Get Started Now",
      color: "#FF5841",
      featured: true,
    },
  ];
