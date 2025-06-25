"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { facilitiesService } from "@/services/facilities"
import type { Facility } from "@/types"
import { MapPin, Clock, DollarSign } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export function FeaturedFacilities() {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await facilitiesService.getFacilities({ limit: 6 })
        setFacilities(response.data)
      } catch (error) {
        console.error("Error fetching facilities:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFacilities()
  }, [])

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Facilities</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most popular sports facilities, carefully selected for their quality and amenities.
            </p>
          </div>
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Facilities</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our most popular sports facilities, carefully selected for their quality and amenities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((facility) => (
            <Card key={facility._id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={facility.image || "/placeholder.svg?height=200&width=400"}
                  alt={facility.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                  {formatCurrency(facility.pricePerHour)}/hr
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {facility.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{facility.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    {facility.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    Available 24/7
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center text-lg font-semibold text-primary">
                    <DollarSign className="h-5 w-5" />
                    {facility.pricePerHour}/hour
                  </div>
                  <Link href={`/facilities/${facility._id}`}>
                    <Button>View Details</Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/facilities">
            <Button size="lg" variant="outline">
              View All Facilities
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
