"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Team Captain",
    image: "/placeholder.svg?height=80&width=80",
    rating: 5,
    content:
      "Amazing platform! Booking facilities has never been easier. The quality of venues is outstanding and the booking process is seamless.",
  },
  {
    id: 2,
    name: "Mike Chen",
    role: "Fitness Enthusiast",
    image: "/placeholder.svg?height=80&width=80",
    rating: 5,
    content:
      "I use this platform regularly for my training sessions. Great variety of facilities and excellent customer service. Highly recommended!",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Sports Coach",
    image: "/placeholder.svg?height=80&width=80",
    rating: 5,
    content:
      "Perfect for organizing team practices. The availability checker is accurate and the facilities are always well-maintained.",
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Event Organizer",
    image: "/placeholder.svg?height=80&width=80",
    rating: 5,
    content:
      "Organized multiple tournaments using this platform. The booking system is reliable and the support team is incredibly helpful.",
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers have to say about their experience.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Card className="overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0">
                    <Image
                      src={testimonials[currentIndex].image || "/placeholder.svg"}
                      alt={testimonials[currentIndex].name}
                      width={80}
                      height={80}
                      className="rounded-full"
                    />
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <div className="flex justify-center md:justify-start mb-4">
                      {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>

                    <blockquote className="text-lg md:text-xl text-gray-700 mb-6 italic">
                      "{testimonials[currentIndex].content}"
                    </blockquote>

                    <div>
                      <div className="font-semibold text-lg">{testimonials[currentIndex].name}</div>
                      <div className="text-gray-500">{testimonials[currentIndex].role}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg"
              onClick={prevTestimonial}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg"
              onClick={nextTestimonial}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? "bg-primary" : "bg-gray-300"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
