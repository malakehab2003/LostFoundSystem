'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Filter } from 'lucide-react'

export function SearchSection() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-card border-y border-border">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">Advanced Search</h3>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search items (keys, phone, wallet...)"
                  className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground h-11"
                />
              </div>
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-start">
              <select className="flex-1 px-4 py-2 bg-background border border-border rounded-md text-foreground text-sm">
                <option>All Categories</option>
                <option>Electronics</option>
                <option>Documents</option>
                <option>Clothing</option>
                <option>Jewelry</option>
                <option>Keys & Wallets</option>
                <option>Other</option>
              </select>

              <select className="flex-1 px-4 py-2 bg-background border border-border rounded-md text-foreground text-sm">
                <option>Status: Any</option>
                <option>Lost Items</option>
                <option>Found Items</option>
              </select>

              <select className="flex-1 px-4 py-2 bg-background border border-border rounded-md text-foreground text-sm">
                <option>Radius: 10 miles</option>
                <option>5 miles</option>
                <option>25 miles</option>
                <option>50 miles</option>
              </select>

              <Button variant="outline" className="border-border text-foreground hover:bg-secondary h-10 px-4 whitespace-nowrap">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition">
                Recently Posted
              </button>
              <button className="px-3 py-1 rounded-full text-sm bg-secondary text-foreground border border-border hover:bg-secondary/80 transition">
                Verified Only
              </button>
              <button className="px-3 py-1 rounded-full text-sm bg-secondary text-foreground border border-border hover:bg-secondary/80 transition">
                Has Reward
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
