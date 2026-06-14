'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Clock, Heart } from 'lucide-react'

interface ListingCardProps {
  id: string
  image: string
  title: string
  category: string
  status: 'lost' | 'found'
  location: string
  date: string
  reward?: string
  verified?: boolean
  index?: number
}

export function ListingCard({
  image,
  title,
  category,
  status,
  location,
  date,
  reward,
  verified,
  index = 0,
}: ListingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      viewport={{ once: true }}
      className="group rounded-xl bg-card border border-border overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all"
    >
      <div className="relative h-48 bg-secondary overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <Badge variant={status === 'lost' ? 'default' : 'secondary'} className={status === 'lost' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}>
            {status === 'lost' ? 'Lost' : 'Found'}
          </Badge>
          {verified && (
            <Badge className="bg-accent text-accent-foreground">Verified</Badge>
          )}
        </div>
        {reward && (
          <div className="absolute bottom-3 left-3 bg-yellow-500/90 text-black text-sm font-semibold px-3 py-1 rounded-full">
            ${reward} Reward
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-foreground text-lg mb-2 line-clamp-2">{title}</h3>

        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline" className="text-xs">{category}</Badge>
          <button className="text-muted-foreground hover:text-accent transition">
            <Heart className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>{date}</span>
          </div>
        </div>

        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          View Details
        </Button>
      </div>
    </motion.div>
  )
}
