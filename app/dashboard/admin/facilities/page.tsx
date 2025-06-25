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
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { formatCurrency } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearError,
  deleteFacility,
  fetchFacilities,
} from "@/store/slices/facilitiesSlice";
import {
  DollarSign,
  Edit,
  Eye,
  MapPin,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function AdminFacilitiesContent() {
  const dispatch = useAppDispatch();
  const { facilities, isLoading, error } = useAppSelector(
    (state) => state.facilities
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFacilities, setFilteredFacilities] = useState(facilities);

  useEffect(() => {
    dispatch(fetchFacilities({ limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    const filtered = facilities.filter(
      (facility) =>
        facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facility.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFacilities(filtered);
  }, [facilities, searchTerm]);

  const handleDeleteFacility = async (facilityId: string) => {
    const result = await dispatch(deleteFacility(facilityId));
    if (deleteFacility.fulfilled.match(result)) {
      toast.success("Facility deleted successfully");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const activeFacilities = facilities.filter((f) => !f.isDeleted);
  const deletedFacilities = facilities.filter((f) => f.isDeleted);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Facility Management</h1>
          <p className="text-gray-600">Manage your sports facilities</p>
        </div>
        <Link href="/dashboard/admin/facilities/add">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Facility
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{facilities.length}</div>
            <div className="text-sm text-gray-600">Total Facilities</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {activeFacilities.length}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {deletedFacilities.length}
            </div>
            <div className="text-sm text-gray-600">Deleted</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(
                activeFacilities.reduce((sum, f) => sum + f.pricePerHour, 0) /
                  activeFacilities.length || 0
              )}
            </div>
            <div className="text-sm text-gray-600">Avg. Price/Hour</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search facilities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFacilities.map((facility) => (
          <Card key={facility._id} className="overflow-hidden">
            <div className="relative h-48">
              <Image
                src={facility.image || "/placeholder.svg?height=200&width=400"}
                alt={facility.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge
                  variant={facility.isDeleted ? "destructive" : "secondary"}
                >
                  {facility.isDeleted ? "Deleted" : "Active"}
                </Badge>
              </div>
            </div>

            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">{facility.name}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {facility.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-2" />
                  {facility.location}
                </div>
                <div className="flex items-center text-sm font-semibold text-primary">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {formatCurrency(facility.pricePerHour)}/hour
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Link href={`/dashboard/admin/facilities/edit/${facility._id}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                {!facility.isDeleted && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Facility</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{facility.name}"?
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteFacility(facility._id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFacilities.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No facilities found</h3>
            <p className="text-gray-600 mb-4">
              {facilities.length === 0
                ? "Get started by adding your first facility"
                : "Try adjusting your search criteria"}
            </p>
            {facilities.length === 0 && (
              <Link href="/dashboard/admin/facilities/add">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Facility
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function AdminFacilities() {
  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <AdminFacilitiesContent />
    </DashboardLayout>
  );
}
