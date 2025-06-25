"use client";

import { UserSidebar } from "@/components/dashboard/user-sidebar";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/hooks/use-auth";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  cancelBooking,
  clearError,
  fetchUserBookings,
} from "@/store/slices/bookingsSlice";
import { Calendar, Clock, DollarSign, Eye, MapPin, X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";

function UserDashboardContent() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const {
    userBookings: bookings,
    isLoading,
    isCancelling,
    error,
  } = useAppSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchUserBookings());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleCancelBooking = async (bookingId: string) => {
    const result = await dispatch(cancelBooking(bookingId));
    if (cancelBooking.fulfilled.match(result)) {
      toast.success("Booking cancelled successfully");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "unconfirmed":
        return "bg-yellow-100 text-yellow-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">{getCurrentDate()}</p>
        <p className="text-gray-600 mt-1">
          Manage your bookings and discover new facilities.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Bookings
                </p>
                <p className="text-2xl font-bold">{bookings.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Bookings
                </p>
                <p className="text-2xl font-bold">
                  {bookings.filter((b) => b.isBooked === "confirmed").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    bookings.reduce((sum, b) => sum + b.payableAmount, 0)
                  )}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Link href="/facilities">
              <Button>Browse Facilities</Button>
            </Link>
            <Link href="/booking">
              <Button variant="outline">New Booking</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* My Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>My Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
              <p className="text-gray-600 mb-4">
                Start by booking your first facility!
              </p>
              <Link href="/facilities">
                <Button>Browse Facilities</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.slice(0, 5).map((booking) => (
                <div
                  key={booking._id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">
                          {booking.facility.name}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            booking.isBooked
                          )}`}
                        >
                          {booking.isBooked}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(booking.date)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {formatTime(booking.startTime)} -{" "}
                          {formatTime(booking.endTime)}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {booking.facility.location}
                        </div>
                      </div>

                      <div className="mt-2">
                        <span className="font-semibold text-primary">
                          {formatCurrency(booking.payableAmount)}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>

                      {booking.isBooked === "confirmed" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancelBooking(booking._id)}
                          disabled={isCancelling === booking._id}
                        >
                          {isCancelling === booking._id ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <>
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {bookings.length > 5 && (
                <div className="text-center pt-4">
                  <Link href="/dashboard/user/bookings">
                    <Button variant="outline">View All Bookings</Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function UserDashboard() {
  return (
    <DashboardLayout sidebar={<UserSidebar />}>
      <UserDashboardContent />
    </DashboardLayout>
  );
}
