"use client";

import { motion } from "framer-motion";
import {
  Smartphone,
  CreditCard,
  FileText,
  Heart,
  Backpack,
  Key,
} from "lucide-react";

export function CategoriesSection() {
  const categories = [
    { icon: Smartphone, label: "Electronics" },
    { icon: CreditCard, label: "Wallets & Cards" },
    { icon: FileText, label: "Documents" },
    { icon: Heart, label: "Pets" },
    { icon: Backpack, label: "Bags & Luggage" },
    { icon: Key, label: "Keys & Access" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="w-full py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-6"
          >
            Explore by Category
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          >
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ y: -6 }}
                  className="group bg-card p-6 rounded-2xl text-center border border-border hover:border-primary hover:shadow-[0_12px_40px_rgba(120,119,198,0.15)] hover:-translate-y-1.5 transition-all duration-200 cursor-pointer"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200"
                  >
                    <Icon size={20} strokeWidth={2} />
                  </motion.div>
                  <h4 className="font-semibold text-sm text-foreground">
                    {cat.label}
                  </h4>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
