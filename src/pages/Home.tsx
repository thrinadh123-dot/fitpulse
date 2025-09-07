import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Dumbbell, BrainCircuit, LineChart, ShieldCheck, Instagram, Twitter, Linkedin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ParallaxSection = ({ children, backgroundImage }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"], 
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <section
      ref={ref}
      className="relative grid place-items-center overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          y: backgroundY,
        }}
      />
      <div className="relative z-10 w-full">
        {children}
      </div>
    </section>
  );
};

// --- Main Home Component ---
const Home = () => {
  // Data based on the PRD
const features = [
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

  const testimonials = [
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

  const pricingPlans = [
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
  
  // Animation variant for scroll-triggered fade-in
  const fadeInAnimation = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white font-[Inter,sans-serif]">
      {/* 1. Hero Section */}
      <ParallaxSection backgroundImage="/assets/image1.jpg">
        <div className="min-h-screen flex flex-col items-center justify-center text-center bg-black/50 p-4">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Precision. Performance. Progress.
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {/* --- CHANGE IS HERE --- */}
            <Link to="/Login">
              <Button size="lg" className="bg-[#FF5841] text-white font-bold text-lg px-8 py-6 rounded-full hover:bg-[#ff745d] hover:shadow-[0_0_25px_#FF5841] transition-all duration-300">
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            {/* --- END OF CHANGE --- */}
          </motion.div>
        </div>
      </ParallaxSection>
      
      {/* 2. Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInAnimation} className="text-center mb-16">
            <h2 className="text-4xl zmd:text-5xl font-bold">A Smarter Way to Get Stronger</h2>
            <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">FitPulse combines cutting-edge technology with proven fitness principles.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <Card className="bg-[#1a1a1a] border-gray-800 text-white h-full hover:border-[#4A8BDF] transition-colors duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="mb-4 inline-block p-4 bg-gray-800 rounded-full">{feature.icon}</div>
                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Live Demo Section */}
      <section className="py-20 px-4 bg-[#121212]">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div {...fadeInAnimation}>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Your Wellness Journey Starts Here.</h2>
            <p className="text-lg text-gray-400 mb-12">Step into balance, clarity, and nature-driven motivation.</p>
            <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-gray-800">
            <video 
              src="/assets/video.mp4"
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover"
            />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. Testimonials Section */}
      <ParallaxSection backgroundImage="/assets/image2.jpg">
        <div className="py-20 px-4 bg-black/60">
          <div className="max-w-4xl mx-auto">
            <motion.div {...fadeInAnimation} className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold">Trusted by Professionals</h2>
            </motion.div>
            <div className="space-y-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <Card className="bg-[#1a1a1a]/80 backdrop-blur-sm border-gray-700">
                    <CardContent className="p-6">
                      <p className="text-lg italic text-gray-300">"{testimonial.quote}"</p>
                      <p className="mt-4 font-bold text-right text-[#FF5841]">
                        — {testimonial.name}, <span className="font-normal text-gray-400">{testimonial.role}</span>
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </ParallaxSection>
      
      {/* 5. Pricing Plans Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInAnimation} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Find the Perfect Plan</h2>
            <p className="text-lg text-gray-400 mt-4">Start for free, upgrade when you're ready.</p>
          </motion.div>
          <div className="flex flex-col lg:flex-row justify-center items-center gap-8">
            {pricingPlans.map((plan) => (
              <motion.div
                key={plan.name}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`w-full max-w-sm ${plan.featured ? 'lg:scale-105' : ''}`}
              >
                <Card className={`bg-[#1a1a1a] border-2 h-full flex flex-col ${plan.featured ? 'border-[#FF5841]' : 'border-gray-800'}`}>
                  <CardContent className="p-8 flex-grow flex flex-col">
                    <h3 className="text-2xl font-bold mb-4" style={{ color: plan.color }}>{plan.name}</h3>
                    <p className="text-5xl font-bold mb-6">{plan.price}<span className="text-lg font-normal text-gray-400">/mo</span></p>
                    <ul className="space-y-3 text-gray-300 mb-8 flex-grow">
                      {plan.features.map(feature => (
                        <li key={feature} className="flex items-center">
                          <ShieldCheck className="h-5 w-5 mr-2 text-green-500" /> {feature}
                        </li>
                      ))}
                    </ul>
                    <Button size="lg" className="w-full font-bold text-lg py-6" style={{ backgroundColor: plan.color }}>
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Signup CTA Section */}
      <section className="py-20 px-4 bg-[#121212] text-center">
        <motion.div {...fadeInAnimation} className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold">Ready to Transform Your Health?</h2>
          <p className="text-lg text-gray-400 mt-4 mb-8">Enter your email to get started with FitPulse and unlock your full potential.</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input type="email" placeholder="you@example.com" className="flex-grow p-4 rounded-md bg-[#2a2a2a] border border-gray-700 focus:ring-2 focus:ring-[#FF5841] outline-none" required />
            <Button type="submit" size="lg" className="bg-[#FF5841] text-white font-bold text-lg px-8 py-4 hover:bg-[#ff745d] transition-colors">
              Join Now
            </Button>
          </form>
        </motion.div>
      </section>

      {/* 7. Footer */}
      <footer className="py-12 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-8">
          <div>
            <h3 className="text-2xl font-bold">FitPulse</h3>
            <p className="text-gray-400 mt-1">© 2025 FitPulse. All Rights Reserved.</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-white"><Instagram /></a>
            <a href="#" className="text-gray-400 hover:text-white"><Twitter /></a>
            <a href="#" className="text-gray-400 hover:text-white"><Linkedin /></a>
          </div>
          <div className="max-w-xs text-sm text-gray-500">
            <p>Disclaimer: This app is not a substitute for professional medical advice. Always consult a healthcare provider for health decisions.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;