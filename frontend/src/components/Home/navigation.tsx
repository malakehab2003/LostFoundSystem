'use client'

import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Navigation() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Search className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">LostFound</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-foreground hover:bg-secondary">
              Browse
            </Button>
            <Button variant="ghost" size="sm" className="text-foreground hover:bg-secondary">
              Post Item
            </Button>
            <Button variant="default" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
