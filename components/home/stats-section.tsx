"use client"

import { useEffect, useState } from "react"
import { TrendingUp, Users, MapPin, Star } from "lucide-react"

const stats = [
  {
    icon: TrendingUp,
    value: "98%",
    label: "Customer Satisfaction",
    description: "Based on 10,000+ reviews",
  },
  {
    icon: Users,
    value: "50K+",
    label: "Active Users",
    description: "Growing community",
  },
  {
    icon: MapPin,
    value: "500+",
    label: "Facilities",
    description: "Across 50+ cities",
  },
  {
    icon: Star,
    value: "4.9",
    label: "Average Rating",
    description: "Highly rated facilities",
  },
]

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("stats-section")
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="stats-section" className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Thousands</h2>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Join our growing community of sports enthusiasts who trust us for their facility booking needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center transform transition-all duration-700 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
              <div className="text-xl font-semibold mb-1">{stat.label}</div>
              <div className="text-blue-100 text-sm">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
