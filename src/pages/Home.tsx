import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";
import { Dumbbell, BrainCircuit, LineChart, ShieldCheck, Instagram, Twitter, Linkedin, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Type definitions
interface Testimonial {
  quote: string;
  name: string;
  avatar?: string;
}

// --- Helper Components ---

const ParallaxSection = ({ children, backgroundImage }: { children: React.ReactNode; backgroundImage: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <section
      ref={ref}
      className="relative grid place-items-center overflow-hidden min-h-screen"
    >
       {/* Background Image Container */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          y: backgroundY, // Apply parallax effect
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 z-10 bg-black/50" />
      <div className="relative z-20 w-full">
        {children}
      </div>
    </section>
  );
};


//autoscroll
const AutoScrollRow: React.FC<{ items: Testimonial[]; direction?: "left" | "right" }> = ({
  items,
  direction = "left",
}) => {
  const rowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    let scrollAmount = 0;
    let rafId = 0;
    let isPaused = false;
    const speed = 0.5; // tweak this to make it faster/slower

    const step = () => {
      if (!isPaused) {
        if (direction === "left") {
          scrollAmount += speed;
          if (scrollAmount >= row.scrollWidth / 2) scrollAmount = 0;
          row.scrollLeft = scrollAmount;
        } else {
          scrollAmount -= speed;
          if (scrollAmount <= 0) scrollAmount = row.scrollWidth / 2;
          row.scrollLeft = scrollAmount;
        }
      }
      rafId = requestAnimationFrame(step);
    };

    const onEnter = () => (isPaused = true);
    const onLeave = () => (isPaused = false);

    row.addEventListener("mouseenter", onEnter);
    row.addEventListener("mouseleave", onLeave);

    step();

    return () => {
      cancelAnimationFrame(rafId);
      row.removeEventListener("mouseenter", onEnter);
      row.removeEventListener("mouseleave", onLeave);
    };
  }, [direction]);

  return (
    <div ref={rowRef} className="overflow-hidden w-full">
      {/* keep cards inline, but ensure inner text CAN wrap */}
      <div className="inline-flex whitespace-nowrap">
        {[...items, ...items].map((t, idx) => (
          <div
            key={idx}
            className="
              min-w-[300px] max-w-sm shrink-0 m-3 p-6 rounded-lg
              bg-[#1a1a1a] border border-gray-800 text-gray-200
              flex flex-col justify-between
              transition-colors duration-200
              hover:border-[#34D399] /* green border on hover */
            "
          >
            {/* important: override inherited nowrap so text wraps correctly */}
            <p className="text-base leading-relaxed mb-4 whitespace-normal break-words">
              "{t.quote}"
            </p>

            <div className="flex items-center gap-3">
              {t.avatar ? (
                <img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-700" />
              )}
              <p className="font-semibold text-gray-300">— {t.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// TrustedByProfessionals Component

const TrustedByProfessionals = () => {
  const testimonials = [
    {
      quote: "Fitpulse completely transformed my workouts. The AI-powered routines keep me consistent and motivated every single day.",
      name: "Rohit Sharma",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      quote: "Tracking my progress is so easy with Fitpulse. I’ve never felt more in control of my fitness journey.",
      name: "Ananya Iyer",
      avatar: "https://randomuser.me/api/portraits/women/34.jpg",
    },
    {
      quote: "Fitpulse feels like having a personal trainer in my pocket. Every workout is tailored to me, and the results show.",
      name: "Arjun Mehta",
      avatar: "https://randomuser.me/api/portraits/men/14.jpg",
    },
    {
      quote: "The nutrition guidance in Fitpulse is a game changer. It helped me balance workouts with diet effortlessly.",
      name: "Priya Reddy",
      avatar: "https://randomuser.me/api/portraits/women/29.jpg",
    },
    {
      quote: "I used to struggle with consistency, but Fitpulse keeps me accountable with daily reminders and easy-to-follow plans.",
      name: "Karthik Nair",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
      quote: "Fitpulse adapts to my performance and suggests the perfect next step. It’s like the app knows me better than I do!",
      name: "Divya Kapoor",
      avatar: "https://randomuser.me/api/portraits/women/56.jpg",
    },
    {
      quote: "With Fitpulse, I cut my workout planning time in half. The personalized plans save me so much effort.",
      name: "Aditya Verma",
      avatar: "https://randomuser.me/api/portraits/men/64.jpg",
    },
    {
      quote: "The progress graphs and detailed insights make Fitpulse stand out. It’s more motivating than any other app I’ve tried.",
      name: "Sneha Joshi",
      avatar: "https://randomuser.me/api/portraits/women/11.jpg",
    },
    {
      quote: "Fitpulse pushes me just enough to grow stronger without burning out. That balance is priceless.",
      name: "Rahul Deshmukh",
      avatar: "https://randomuser.me/api/portraits/men/18.jpg",
    },
    {
      quote: "I love how Fitpulse integrates workouts and recovery. My energy levels have improved drastically.",
      name: "Meera Kulkarni",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    },
    {
      quote: "Fitpulse made me enjoy fitness again. It doesn’t feel like a chore anymore.",
      name: "Vikram Singh",
      avatar: "https://randomuser.me/api/portraits/men/36.jpg",
    },
    {
      quote: "The AI suggestions feel so natural. Fitpulse keeps my workouts fresh and exciting.",
      name: "Neha Patil",
      avatar: "https://randomuser.me/api/portraits/women/41.jpg",
    },
    {
      quote: "Thanks to Fitpulse, I gained muscle and lost fat more efficiently than ever before.",
      name: "Siddharth Rao",
      avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    },
    {
      quote: "Fitpulse gives me a perfect balance of cardio and strength. My stamina has improved a lot.",
      name: "Lakshmi Menon",
      avatar: "https://randomuser.me/api/portraits/women/62.jpg",
    },
    {
      quote: "No more guesswork! Fitpulse tells me exactly what to do, and it works every time.",
      name: "Harshita Gupta",
      avatar: "https://randomuser.me/api/portraits/women/77.jpg",
    },
  ]

  return (
    <section className="py-20 bg-[#0d0d0d] text-white w-screen">
      <div className="px-6">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold">TRUSTED BY PROFESSIONALS</h2>
          <p className="mt-2 text-gray-400">Fitpulse is loved by fitness enthusiasts across India.</p>
        </div>

        {/* Rows */}
        <div className="space-y-10">
          <AutoScrollRow items={testimonials} direction="left" />
          <AutoScrollRow items={testimonials} direction="right" />
        </div>
      </div>
    </section>
  )
}

// --- Main Home Component ---
const Home = () => {
  // Function to scroll to features section
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
  
  return (
    <div className="dark min-h-screen bg-[#0F0F0F] text-white font-[Inter,sans-serif]">
      {/* 1. Hero Section */}
      <ParallaxSection backgroundImage="/assets/image1.jpg">
        <div className="flex flex-col items-center justify-center text-center p-4 min-h-screen">
          <motion.h1
            className="relative text-5xl md:text-7xl font-bold mb-6 text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Precision. Performance. Progress.
          </motion.h1>

          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <Link to="/Login">
              <Button
                size="lg"
                className="bg-[#FF5841] text-white font-bold text-lg px-8 py-6 rounded-full hover:bg-[#ff745d] hover:shadow-[0_0_25px_#FF5841] transition-all duration-300"
              >
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
          {/* Animated Scroll Chevron */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            onClick={scrollToFeatures}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center text-white/80 hover:text-white transition-colors group"
            >
              <span className="text-sm font-medium mb-2 opacity-0 group-hover:opacity-100 transition-opacity">Scroll to explore</span>
              <ChevronDown className="h-8 w-8" />
            </motion.div>
          </motion.div>
        </div>
      </ParallaxSection>
      
      {/* 2. Features Section */}
      <section id="features-section" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold">A Smarter Way to Get Stronger</h2>
            <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">FitPulse combines cutting-edge technology with proven fitness principles.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.15,
                  ease: "easeOut"
                }}
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
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
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
      <TrustedByProfessionals />
      
      {/* 5. Pricing Plans Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
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
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
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

     
      {/* 8. Footer */}
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