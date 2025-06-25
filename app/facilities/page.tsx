"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { formatCurrency } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearError,
  fetchFacilities,
  setPagination,
} from "@/store/slices/facilitiesSlice";
import { DollarSign, Filter, MapPin, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function FacilitiesPage() {
  const dispatch = useAppDispatch();
  const { facilities, isLoading, error, pagination } = useAppSelector(
    (state) => state.facilities
  );

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadFacilities = async () => {
      try {
        console.log("Loading facilities with params:", {
          page: pagination.page,
          limit: pagination.limit,
          searchTerm: searchTerm || undefined,
        });

        await dispatch(
          fetchFacilities({
            page: pagination.page,
            limit: pagination.limit,
            searchTerm: searchTerm || undefined,
          })
        ).unwrap();
      } catch (error) {
        console.error("Failed to load facilities:", error);
      }
    };

    loadFacilities();
  }, [pagination.page, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dispatch(setPagination({ page: 1, limit: pagination.limit }));
      await dispatch(
        fetchFacilities({
          page: 1,
          limit: pagination.limit,
          searchTerm: searchTerm || undefined,
        })
      ).unwrap();
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setPagination({ page: newPage, limit: pagination.limit }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Sports Facilities</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover and book premium sports facilities for your activities.
            Find the perfect venue that matches your needs.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <form
            onSubmit={handleSearch}
            className="flex gap-4 max-w-2xl mx-auto"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search facilities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
            <Button type="button" variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </form>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {/* Facilities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {facilities.map((facility) => (
                <Card
                  key={facility._id}
                  className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={
                        facility.image ||
                        "/placeholder.svg?height=200&width=400"
                      }
                      alt={facility.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      {formatCurrency(facility.pricePerHour)}/hr
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {facility.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {facility.description}
                    </p>

                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {facility.location}
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0">
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center text-lg font-semibold text-primary">
                        <DollarSign className="h-4 w-4" />
                        {facility.pricePerHour}/hr
                      </div>
                      <Link href={`/facilities/${facility._id}`}>
                        <Button size="sm">View Details</Button>
                      </Link>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>

                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((page) => (
                  <Button
                    key={page}
                    variant={pagination.page === page ? "default" : "outline"}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            )}

            {/* No Results */}
            {facilities.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">
                  No facilities found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
