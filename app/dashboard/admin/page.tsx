"use client";

import { AdminSidebar } from "@/components/dashboard/admin-sidebar";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/hooks/use-auth";
import { formatCurrency } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAllBookings } from "@/store/slices/bookingsSlice";
import { fetchFacilities } from "@/store/slices/facilitiesSlice";
import {
  Building,
  Calendar,
  DollarSign,
  Edit,
  Eye,
  Plus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

function AdminDashboardContent() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { facilities, isLoading: facilitiesLoading } = useAppSelector(
    (state) => state.facilities
  );
  const { bookings, isLoading: bookingsLoading } = useAppSelector(
    (state) => state.bookings
  );

  useEffect(() => {
    dispatch(fetchFacilities({ limit: 10 }));
    dispatch(fetchAllBookings({ limit: 10 }));
  }, [dispatch]);

  const totalRevenue = bookings.reduce(
    (sum, booking) => sum + booking.payableAmount,
    0
  );
  const activeFacilities = facilities.filter((f) => !f.isDeleted).length;
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(
    (b) => b.isBooked === "confirmed"
  ).length;

  const isLoading = facilitiesLoading || bookingsLoading;

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
          Manage your facilities, bookings, and users from here.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Facilities
                </p>
                <p className="text-2xl font-bold">{activeFacilities}</p>
              </div>
              <Building className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Bookings
                </p>
                <p className="text-2xl font-bold">{totalBookings}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Confirmed Bookings
                </p>
                <p className="text-2xl font-bold">{confirmedBookings}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600" />
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
            <Link href="/dashboard/admin/facilities/add">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Facility
              </Button>
            </Link>
            <Link href="/dashboard/admin/bookings">
              <Button variant="outline">View All Bookings</Button>
            </Link>
            <Link href="/dashboard/admin/add-admin">
              <Button variant="outline">Add New Admin</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Facilities */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Facilities</CardTitle>
            <Link href="/dashboard/admin/facilities">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {facilities.slice(0, 5).map((facility) => (
                <div
                  key={facility._id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{facility.name}</h3>
                    <p className="text-sm text-gray-600">{facility.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatCurrency(facility.pricePerHour)}/hr
                    </p>
                    <p
                      className={`text-xs ${
                        facility.isDeleted ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {facility.isDeleted ? "Deleted" : "Active"}
                    </p>
                  </div>
                  <div className="ml-4 flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Bookings</CardTitle>
            <Link href="/dashboard/admin/bookings">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookings.slice(0, 5).map((booking) => (
                <div
                  key={booking._id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{booking.facility.name}</h3>
                    <p className="text-sm text-gray-600">{booking.user.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatCurrency(booking.payableAmount)}
                    </p>
                    <p
                      className={`text-xs px-2 py-1 rounded-full ${
                        booking.isBooked === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : booking.isBooked === "canceled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {booking.isBooked}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <AdminDashboardContent />
    </DashboardLayout>
  );
}
