"use client";

import type React from "react";

import { AdminSidebar } from "@/components/dashboard/admin-sidebar";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Textarea } from "@/components/ui/textarea";
import { uploadService } from "@/services/upload";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearCurrentFacility,
  fetchFacilityById,
  updateFacility,
} from "@/store/slices/facilitiesSlice";
import type { FacilityFormData } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Upload, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const facilitySchema = z.object({
  name: z
    .string()
    .min(1, "Facility name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  pricePerHour: z
    .number()
    .min(1, "Price must be at least $1")
    .max(1000, "Price must be less than $1000"),
  location: z
    .string()
    .min(1, "Location is required")
    .max(200, "Location must be less than 200 characters"),
  image: z.string().optional(),
});

type FacilityFormValues = z.infer<typeof facilitySchema>;

function EditFacilityContent() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentFacility: facility, isLoading } = useAppSelector(
    (state) => state.facilities
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FacilityFormValues>({
    resolver: zodResolver(facilitySchema),
  });

  useEffect(() => {
    if (params.id) {
      dispatch(fetchFacilityById(params.id as string));
    }

    return () => {
      dispatch(clearCurrentFacility());
    };
  }, [params.id, dispatch]);

  useEffect(() => {
    if (facility) {
      reset({
        name: facility.name,
        description: facility.description,
        pricePerHour: facility.pricePerHour,
        location: facility.location,
        image: facility.image,
      });
      setImagePreview(facility.image || null);
    }
  }, [facility, reset]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate image file
      const validation = uploadService.validateImageFile(file);
      if (!validation.isValid) {
        toast.error(validation.error || "Invalid image file");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    setIsUploading(true);
    try {
      const result = await uploadService.uploadImage(imageFile);
      return result.display_url;
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image to ImageBB");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: FacilityFormValues) => {
    if (!facility) return;

    setIsSubmitting(true);
    try {
      let imageUrl = data.image;

      if (imageFile) {
        const uploadedImageUrl = await uploadImage();
        if (!uploadedImageUrl) {
          setIsSubmitting(false);
          return;
        }
        imageUrl = uploadedImageUrl ?? undefined;
      }

      const facilityData: Partial<FacilityFormData> = {
        ...data,
        image: imageUrl,
      };

      const result = await dispatch(
        updateFacility({ id: facility._id, data: facilityData })
      );
      if (updateFacility.fulfilled.match(result)) {
        toast.success("Facility updated successfully!");
        router.push("/dashboard/admin/facilities");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to update facility");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setValue("image", "");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Facility not found</h2>
        <Link href="/dashboard/admin/facilities">
          <Button>Back to Facilities</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/admin/facilities">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Facilities
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Facility</h1>
          <p className="text-gray-600">Update facility information</p>
        </div>
      </div>

      {/* Form */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Facility Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Facility Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="e.g., Football Field A"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Describe the facility, its features, and amenities..."
                  rows={4}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pricePerHour">Price per Hour ($) *</Label>
                  <Input
                    id="pricePerHour"
                    type="number"
                    step="0.01"
                    min="1"
                    {...register("pricePerHour", { valueAsNumber: true })}
                    placeholder="50.00"
                    className={errors.pricePerHour ? "border-red-500" : ""}
                  />
                  {errors.pricePerHour && (
                    <p className="text-sm text-red-500">
                      {errors.pricePerHour.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    {...register("location")}
                    placeholder="e.g., Sports Complex, City Center"
                    className={errors.location ? "border-red-500" : ""}
                  />
                  {errors.location && (
                    <p className="text-sm text-red-500">
                      {errors.location.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <Label>Facility Image</Label>

              {imagePreview ? (
                <div className="relative">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Facility preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Upload facility image to ImageBB
                    </p>
                    <p className="text-xs text-gray-500">
                      JPEG, PNG, GIF, WebP, BMP up to 32MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4"
                    onClick={() =>
                      document.getElementById("image-upload")?.click()
                    }
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Image
                  </Button>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link href="/dashboard/admin/facilities">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting || isUploading}>
                {isSubmitting || isUploading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    {isUploading ? "Uploading to ImageBB..." : "Updating..."}
                  </>
                ) : (
                  "Update Facility"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function EditFacility() {
  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <EditFacilityContent />
    </DashboardLayout>
  );
}
