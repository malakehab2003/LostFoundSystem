import * as React from "react";
import { ArrowRight, Search, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
export const CTABannerSection: React.FC = () => {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-16 border-y border-border my">
      <div className="max-w-4xl mx-auto">
        <motion.div
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
            ease: "easeOut",
          }}
          className="rounded-3xl bg-gradient-to-br from-primary/[0.03] via-accent/[0.05] to-primary/[0.03] border border-primary/10 p-8 md:p-16 text-center relative overflow-hidden shadow-sm"
        >
          <div
            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
            aria-hidden="true"
          />
          <div
            className="absolute -top-24 -left-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent/5 rounded-full blur-3xl"
            aria-hidden="true"
          />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
              Ready to Find Your{" "}
              <span className="text-primary">Lost Item?</span>
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of people who have successfully recovered their
              lost items. Post your item today and get notified when someone
              finds it.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg">
                <Link to="/items?type=lost">
                  <PlusCircle className="size-4" />
                  <span>Post Lost Item Now</span>
                  <ArrowRight className="size-3 ml-1 opacity-70" />
                </Link>
              </Button>

              <Button asChild size="lg" variant="outline">
                <Link to="/items?type=found">
                  <Search className="size-4" />
                  <span>Browse Found Items</span>
                </Link>
              </Button>
            </div>

            <p className="text-sm font-medium text-muted-foreground/80 mt-10 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
              It's free to post and search. Help your community recover what
              matters.
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
