import { useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

// Type definitions
interface Testimonial {
  quote: string;
  name: string;
  avatar?: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "Fitpulse completely transformed my workouts. The AI routines keep me consistent, focused, and progressing every single day.",
    name: "Rohit Sharma",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
  {
    quote: "Tracking my fitness journey has never been this simple. Fitpulse gives me clarity and confidence in every step I take.",
    name: "Ananya Iyer",
    avatar: "https://i.pravatar.cc/150?img=47",
  },
  {
    quote: "It feels like having a personal trainer guiding me 24/7. Every session is tailored perfectly to my goals.",
    name: "Arjun Mehta",
    avatar: "https://i.pravatar.cc/150?img=14",
  },
  {
    quote: "Fitpulse’s nutrition plans helped me balance my workouts and diet effortlessly. The results are genuinely visible!",
    name: "Priya Reddy",
    avatar: "https://i.pravatar.cc/150?img=29",
  },
  {
    quote: "I struggled with consistency before, but Fitpulse keeps me motivated with reminders and flexible workout plans.",
    name: "Karthik Nair",
    avatar: "https://i.pravatar.cc/150?img=55",
  },
  {
    quote: "The app adapts to my performance automatically. It pushes me just enough without overwhelming me.",
    name: "Divya Kapoor",
    avatar: "https://i.pravatar.cc/150?img=56",
  },
  {
    quote: "Fitpulse cut my planning time in half. I just open the app and follow the routine—no confusion, only progress.",
    name: "Aditya Verma",
    avatar: "https://i.pravatar.cc/150?img=64",
  },
  {
    quote: "The insights and progress graphs keep me motivated. Fitpulse shows improvements I didn’t even notice myself!",
    name: "Sneha Joshi",
    avatar: "https://i.pravatar.cc/150?img=11",
  },
];

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
    const speed = 0.5;

    const step = () => {
      if (!isPaused) {
        if (direction === "left") {
          scrollAmount += speed;
          if (scrollAmount >= row.scrollWidth / 2) scrollAmount = 0;
        } else {
          scrollAmount -= speed;
          if (scrollAmount <= 0) scrollAmount = row.scrollWidth / 2;
        }
        row.scrollLeft = scrollAmount;
      }
      rafId = requestAnimationFrame(step);
    };

    const onEnter = () => (isPaused = true);
    const onLeave = () => (isPaused = false);

    row.addEventListener("mouseenter", onEnter);
    row.addEventListener("mouseleave", onLeave);

    // Initial fill of the scroll position for the right-scrolling row
    if (direction === "right") {
      row.scrollLeft = row.scrollWidth / 2;
      scrollAmount = row.scrollLeft;
    }


    step();

    return () => {
      cancelAnimationFrame(rafId);
      row.removeEventListener("mouseenter", onEnter);
      row.removeEventListener("mouseleave", onLeave);
    };
  }, [direction]);

  return (
    <div ref={rowRef} className="overflow-hidden w-full">
      <div className="inline-flex whitespace-nowrap">
        {[...items, ...items].map((t, idx) => (
          <Card
            key={idx}
            className="min-w-[300px] max-w-sm shrink-0 m-3 p-6 rounded-lg bg-[#1a1a1a] border-gray-800 text-gray-200 flex flex-col justify-between transition-colors duration-200 hover:border-primary"
          >
            <CardContent className="p-0">
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const TrustedByProfessionals = () => {
  return (
    <section className="py-20 bg-[#0d0d0d] text-white w-full overflow-x-hidden">
      <div className="px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold">TRUSTED BY PROFESSIONALS</h2>
          <p className="mt-2 text-gray-400">Fitpulse is loved by fitness enthusiasts across India.</p>
        </div>
        <div className="space-y-10">
          <AutoScrollRow items={testimonials} direction="left" />
          <AutoScrollRow items={testimonials.slice().reverse()} direction="right" />
        </div>
      </div>
    </section>
  );
};

export default TrustedByProfessionals;