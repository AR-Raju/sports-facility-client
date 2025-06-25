"use client";

import { AdminSidebar } from "@/components/dashboard/admin-sidebar";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearError,
  fetchAllBookings,
  updateBookingStatus,
} from "@/store/slices/bookingsSlice";
import {
  Calendar,
  Check,
  Clock,
  DollarSign,
  MapPin,
  Search,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function AdminBookingsContent() {
  const dispatch = useAppDispatch();
  const { bookings, isLoading, error } = useAppSelector(
    (state) => state.bookings
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [filteredBookings, setFilteredBookings] = useState(bookings);

  useEffect(() => {
    dispatch(fetchAllBookings({ limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    let filtered = bookings;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.facility.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by booking status
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (booking) => booking.isBooked === statusFilter
      );
    }

    // Filter by payment status
    if (paymentFilter !== "all") {
      filtered = filtered.filter(
        (booking) => booking.paymentStatus === paymentFilter
      );
    }

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, statusFilter, paymentFilter]);

  const handleUpdateBookingStatus = async (
    bookingId: string,
    status: "confirmed" | "canceled"
  ) => {
    const result = await dispatch(updateBookingStatus({ bookingId, status }));
    if (updateBookingStatus.fulfilled.match(result)) {
      toast.success(`Booking ${status} successfully`);
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const totalRevenue = bookings.reduce(
    (sum, booking) => sum + booking.payableAmount,
    0
  );
  const confirmedBookings = bookings.filter((b) => b.isBooked === "confirmed");
  const pendingBookings = bookings.filter((b) => b.isBooked === "unconfirmed");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Booking Management</h1>
        <p className="text-gray-600">Manage all facility bookings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{bookings.length}</div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {confirmedBookings.length}
            </div>
            <div className="text-sm text-gray-600">Confirmed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {pendingBookings.length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalRevenue)}
            </div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Booking Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="unconfirmed">Pending</SelectItem>
                <SelectItem value="canceled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {bookings.length === 0
                  ? "No bookings yet"
                  : "No bookings match your filters"}
              </h3>
              <p className="text-gray-600">
                {bookings.length === 0
                  ? "Bookings will appear here once users start booking facilities"
                  : "Try adjusting your search or filter criteria"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-lg">
                          {booking.facility.name}
                        </h3>
                        <Badge className={getStatusColor(booking.isBooked)}>
                          {booking.isBooked}
                        </Badge>
                        <Badge
                          className={getPaymentStatusColor(
                            booking.paymentStatus
                          )}
                        >
                          {booking.paymentStatus}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          {booking.user.name}
                        </div>
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
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2" />
                          {formatCurrency(booking.payableAmount)}
                        </div>
                      </div>

                      <div className="text-sm text-gray-500">
                        <p>Customer: {booking.user.email}</p>
                        {booking.transactionId && (
                          <p>Transaction ID: {booking.transactionId}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {booking.isBooked === "unconfirmed" && (
                        <>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Confirm
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Confirm Booking
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to confirm this booking?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleUpdateBookingStatus(
                                      booking._id,
                                      "confirmed"
                                    )
                                  }
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Confirm Booking
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Reject Booking
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to reject this booking?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleUpdateBookingStatus(
                                      booking._id,
                                      "canceled"
                                    )
                                  }
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Reject Booking
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminBookings() {
  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <AdminBookingsContent />
    </DashboardLayout>
  );
}
