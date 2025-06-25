"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchFacilityById, clearCurrentFacility, clearError } from "@/store/slices/facilitiesSlice"
import { useAuth } from "@/hooks/use-auth"
import { MapPin, Clock, DollarSign, Users, Star, Calendar } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { toast } from "sonner"

export default function FacilityDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAuth()
  const { currentFacility: facility, isLoading, error } = useAppSelector((state) => state.facilities)

  useEffect(() => {
    if (params.id) {
      dispatch(fetchFacilityById(params.id as string))
    }

    return () => {
      dispatch(clearCurrentFacility())
    }
  }, [params.id, dispatch])

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.error("Please login to book a facility")
      router.push("/auth/login")
      return
    }
    router.push(`/booking?facility=${facility?._id}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!facility) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Facility not found</h1>
          <Button onClick={() => router.push("/facilities")}>Back to Facilities</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative h-96 rounded-lg overflow-hidden mb-8">
          <Image
            src={facility.image || "/placeholder.svg?height=400&width=800"}
            alt={facility.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-end">
            <div className="p-8 text-white">
              <h1 className="text-4xl font-bold mb-2">{facility.name}</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {facility.location}
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-1" />
                  {facility.pricePerHour}/hour
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Facility</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{facility.description}</p>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Features & Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span>Team Sports</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>24/7 Access</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-primary" />
                    <span>Premium Quality</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div>
                      <div className="font-semibold">John Doe</div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-gray-600 text-sm">Great facility with excellent amenities!</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card>
              <CardHeader>
                <CardTitle>Book This Facility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{formatCurrency(facility.pricePerHour)}</div>
                  <div className="text-gray-600">per hour</div>
                </div>

                <Button onClick={handleBookNow} className="w-full" size="lg">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Now
                </Button>

                <div className="text-center text-sm text-gray-500">Free cancellation up to 24 hours before</div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm">{facility.location}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm">Open 24/7</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
