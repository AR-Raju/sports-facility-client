"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchFacilityById, clearCurrentFacility } from "@/store/slices/facilitiesSlice"
import { createBooking, checkAvailability, clearAvailableSlots, clearError } from "@/store/slices/bookingsSlice"
import { useAuth } from "@/hooks/use-auth"
import type { TimeSlot } from "@/types"
import { Calendar, Clock, DollarSign } from "lucide-react"
import { formatCurrency, formatTime } from "@/lib/utils"
import { toast } from "sonner"

const bookingSchema = z.object({
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
})

type BookingFormData = z.infer<typeof bookingSchema>

export default function BookingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAuth()
  const facilityId = searchParams.get("facility")

  const { currentFacility: facility, isLoading: facilityLoading } = useAppSelector((state) => state.facilities)
  const { availableSlots, isLoading: slotsLoading, isCreating, error } = useAppSelector((state) => state.bookings)

  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  })

  const selectedDate = watch("date")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    if (!facilityId) {
      router.push("/facilities")
      return
    }

    dispatch(fetchFacilityById(facilityId))

    return () => {
      dispatch(clearCurrentFacility())
      dispatch(clearAvailableSlots())
    }
  }, [facilityId, isAuthenticated, dispatch, router])

  useEffect(() => {
    if (selectedDate && facilityId) {
      dispatch(
        checkAvailability({
          date: selectedDate,
          facility: facilityId,
        }),
      )
    }
  }, [selectedDate, facilityId, dispatch])

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot)
    setValue("startTime", slot.startTime)
    setValue("endTime", slot.endTime)
  }

  const calculateAmount = () => {
    if (!facility || !selectedSlot) return 0
    const startTime = new Date(`1970-01-01T${selectedSlot.startTime}:00`)
    const endTime = new Date(`1970-01-01T${selectedSlot.endTime}:00`)
    const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)
    return hours * facility.pricePerHour
  }

  const onSubmit = async (data: BookingFormData) => {
    if (!facilityId) return

    const bookingData = {
      facility: facilityId,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
    }

    const result = await dispatch(createBooking(bookingData))
    if (createBooking.fulfilled.match(result)) {
      toast.success("Booking created successfully!")
      router.push("/dashboard/user")
    }
  }

  if (facilityLoading) {
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Book {facility.name}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Booking Form */}
            <Card>
              <CardHeader>
                <CardTitle>Select Date & Time</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      {...register("date")}
                      className={errors.date ? "border-red-500" : ""}
                    />
                    {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
                  </div>

                  {selectedDate && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Available Time Slots</Label>
                        {slotsLoading && <LoadingSpinner size="sm" />}
                      </div>

                      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                        {availableSlots.map((slot, index) => (
                          <Button
                            key={index}
                            type="button"
                            variant={selectedSlot === slot ? "default" : "outline"}
                            onClick={() => handleSlotSelect(slot)}
                            className="text-sm"
                          >
                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                          </Button>
                        ))}
                      </div>

                      {availableSlots.length === 0 && !slotsLoading && (
                        <p className="text-center text-gray-500 py-4">No available slots for this date</p>
                      )}
                    </div>
                  )}

                  {selectedSlot && (
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Booking Summary</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Date:</span>
                            <span>{selectedDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Time:</span>
                            <span>
                              {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Duration:</span>
                            <span>2 hours</span>
                          </div>
                          <div className="flex justify-between font-semibold">
                            <span>Total Amount:</span>
                            <span>{formatCurrency(calculateAmount())}</span>
                          </div>
                        </div>
                      </div>

                      <Button type="submit" className="w-full" disabled={isCreating}>
                        {isCreating ? (
                          <>
                            <LoadingSpinner size="sm" className="mr-2" />
                            Processing...
                          </>
                        ) : (
                          "Confirm Booking"
                        )}
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Facility Info */}
            <Card>
              <CardHeader>
                <CardTitle>Facility Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video relative rounded-lg overflow-hidden">
                  <img
                    src={facility.image || "/placeholder.svg?height=200&width=400"}
                    alt={facility.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">{facility.name}</h3>
                  <p className="text-gray-600 mb-4">{facility.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span>{formatCurrency(facility.pricePerHour)} per hour</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{facility.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>Available 24/7</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
