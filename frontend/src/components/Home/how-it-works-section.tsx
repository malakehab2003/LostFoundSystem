import * as React from "react";
import { Plus, Search, MessageSquare, CircleCheckBig } from "lucide-react";
import { motion } from "framer-motion";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  stepLabel: string;
}
const STEPS: Step[] = [
  {
    id: 1,
    stepLabel: "Step 1",
    title: "Report or Search",
    description:
      "Post your missing item details or browse found items in your area.",
    icon: Plus,
  },
  {
    id: 2,
    stepLabel: "Step 2",
    title: "Connect Securely",
    description:
      "Our automated matching system notifies relevant parties to start a chat.",
    icon: Search,
  },
  {
    id: 3,
    stepLabel: "Step 3",
    title: "Verified Return",
    description:
      "Coordinate a safe meeting point and return the item to its owner.",
    icon: MessageSquare,
  },
  {
    id: 4,
    title: "Reunite & Celebrate",
    description:
      "Successfully recover your item and celebrate with the community.",
    icon: CircleCheckBig,
    stepLabel: "Step 4",
  },
];
export const HowItWorksSection: React.FC = () => {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-24 ">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 text-center">
          <motion.h2
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.5,
            }}
            className="text-2xl md:text-5xl font-bold tracking-tight text-foreground/90 mb-6"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.5,
              delay: 0.1,
            }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Our simple 4-step process makes it easy to find or post lost items.
            We've streamlined the recovery process to focus on community and
            speed.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === STEPS.length - 1;
            return (
              <motion.div
                key={step.id}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                className="group relative flex flex-col items-center lg:items-start text-center lg:text-left"
              >
                {/* Connecting Line (Desktop Only) */}
                {!isLast && (
                  <div
                    className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/30 via-primary/10 to-transparent z-0"
                    aria-hidden="true"
                  />
                )}

                {/* Step Icon Container */}
                <div className="relative z-10 mb-8 p-6 rounded-2xl bg-card border border-border group-hover:border-primary/40 transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-xl bg-primary/5 flex items-center justify-center text-primary transition-transform duration-300 group-hover:scale-110">
                    <Icon size={32} strokeWidth={1.5} />
                  </div>
                </div>

                {/* Content */}
                <div className="px-4 lg:px-0">
                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                      {step.stepLabel}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">
                    {step.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px] lg:max-w-none mx-auto lg:mx-0">
                    {step.description}
                  </p>
                </div>

                {/* Vertical Connector for Mobile */}
                {!isLast && (
                  <div
                    className="lg:hidden w-px h-12 bg-gradient-to-b from-primary/20 to-transparent mt-8 mb-4"
                    aria-hidden="true"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
