"use client";
import { motion } from "framer-motion";
import heroill from "@/assets/hero-illustration.png";
import { Button } from "../ui/button";
export function HeroSection() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-20 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-10">
        <div className="space-y-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <svg
              className="w-3.5 h-3.5 text-violet-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Community Driven Network
          </div>

          <h1 className="text-5xl font-bold leading-tight tracking-tight text-slate-800">
            Reuniting People
            <br />
            with Their
            <br />
            Belongings
          </h1>

          <p className="text-lg text-foreground/60 max-w-md">
            The most trusted digital lost and found network. Built on community
            trust, verified returns, and seamless communication.
          </p>

          <div className="flex gap-4">
            <Button size="lg">Report Lost Item</Button>
            <Button size="lg" variant="outline">
              Report Found Item
            </Button>
          </div>

          <div className="flex gap-24 text-sm text-slate-500 pt-4">
            <div>
              <span className="font-bold text-primary">10,000+</span> Items
              Returned
            </div>
            <div>
              <span className="font-bold text-primary">98%</span> Success Rate
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="hidden lg:block"
        >
          <div className="relative">
            <img
              src={heroill}
              alt="Lost & Found platform illustration"
              className="w-full h-auto drop-shadow-lg"
            />

            {/* Decorative blur element */}
            <div className="absolute -bottom-4 -right-4 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-10"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
