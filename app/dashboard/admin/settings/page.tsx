/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { AdminSidebar } from "@/components/dashboard/admin-sidebar";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Globe, Mail, Save, Settings, Shield } from "lucide-react";
import { useState } from "react";

function AdminSettingsPageContent() {
  const [loading, setLoading] = useState(false);
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Sports Facility Booking",
    siteDescription: "Book your favorite sports facilities easily",
    contactEmail: "admin@sportsbooking.com",
    supportPhone: "+1-234-567-8900",
    timezone: "UTC",
    currency: "USD",
  });

  const [bookingSettings, setBookingSettings] = useState({
    maxAdvanceBookingDays: 30,
    minBookingDuration: 60,
    maxBookingDuration: 480,
    cancellationDeadline: 24,
    autoConfirmBookings: true,
    allowWaitlist: true,
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUsername: "",
    smtpPassword: "",
    fromEmail: "noreply@sportsbooking.com",
    fromName: "Sports Booking System",
  });

  const [securitySettings, setSecuritySettings] = useState({
    requireEmailVerification: true,
    enableTwoFactor: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireStrongPassword: true,
  });

  const { toast } = useToast();

  const handleSaveGeneral = async () => {
    setLoading(true);
    try {
      // API call to save general settings
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Settings Saved",
        description: "General settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBooking = async () => {
    setLoading(true);
    try {
      // API call to save booking settings
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Settings Saved",
        description: "Booking settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmail = async () => {
    setLoading(true);
    try {
      // API call to save email settings
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Settings Saved",
        description: "Email settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSecurity = async () => {
    setLoading(true);
    try {
      // API call to save security settings
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Settings Saved",
        description: "Security settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">System Settings</h1>
        <p className="text-muted-foreground">
          Configure system-wide settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">
            <Globe className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="booking">
            <Settings className="h-4 w-4 mr-2" />
            Booking
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic site information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={generalSettings.siteName}
                    onChange={(e) =>
                      setGeneralSettings((prev) => ({
                        ...prev,
                        siteName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={(e) =>
                      setGeneralSettings((prev) => ({
                        ...prev,
                        contactEmail: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={(e) =>
                    setGeneralSettings((prev) => ({
                      ...prev,
                      siteDescription: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="supportPhone">Support Phone</Label>
                  <Input
                    id="supportPhone"
                    value={generalSettings.supportPhone}
                    onChange={(e) =>
                      setGeneralSettings((prev) => ({
                        ...prev,
                        supportPhone: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={generalSettings.timezone}
                    onValueChange={(value) =>
                      setGeneralSettings((prev) => ({
                        ...prev,
                        timezone: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                      <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveGeneral} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  Save General Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="booking">
          <Card>
            <CardHeader>
              <CardTitle>Booking Settings</CardTitle>
              <CardDescription>
                Configure booking rules and limitations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="maxAdvanceBookingDays">
                    Max Advance Booking (days)
                  </Label>
                  <Input
                    id="maxAdvanceBookingDays"
                    type="number"
                    value={bookingSettings.maxAdvanceBookingDays}
                    onChange={(e) =>
                      setBookingSettings((prev) => ({
                        ...prev,
                        maxAdvanceBookingDays: Number.parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cancellationDeadline">
                    Cancellation Deadline (hours)
                  </Label>
                  <Input
                    id="cancellationDeadline"
                    type="number"
                    value={bookingSettings.cancellationDeadline}
                    onChange={(e) =>
                      setBookingSettings((prev) => ({
                        ...prev,
                        cancellationDeadline: Number.parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="minBookingDuration">
                    Min Booking Duration (minutes)
                  </Label>
                  <Input
                    id="minBookingDuration"
                    type="number"
                    value={bookingSettings.minBookingDuration}
                    onChange={(e) =>
                      setBookingSettings((prev) => ({
                        ...prev,
                        minBookingDuration: Number.parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxBookingDuration">
                    Max Booking Duration (minutes)
                  </Label>
                  <Input
                    id="maxBookingDuration"
                    type="number"
                    value={bookingSettings.maxBookingDuration}
                    onChange={(e) =>
                      setBookingSettings((prev) => ({
                        ...prev,
                        maxBookingDuration: Number.parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-confirm Bookings</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically confirm bookings without admin approval
                    </p>
                  </div>
                  <Switch
                    checked={bookingSettings.autoConfirmBookings}
                    onCheckedChange={(checked) =>
                      setBookingSettings((prev) => ({
                        ...prev,
                        autoConfirmBookings: checked,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Waitlist</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to join waitlist for fully booked slots
                    </p>
                  </div>
                  <Switch
                    checked={bookingSettings.allowWaitlist}
                    onCheckedChange={(checked) =>
                      setBookingSettings((prev) => ({
                        ...prev,
                        allowWaitlist: checked,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveBooking} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Booking Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>
                Configure SMTP settings for email notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={emailSettings.smtpHost}
                    onChange={(e) =>
                      setEmailSettings((prev) => ({
                        ...prev,
                        smtpHost: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    value={emailSettings.smtpPort}
                    onChange={(e) =>
                      setEmailSettings((prev) => ({
                        ...prev,
                        smtpPort: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <Input
                    id="smtpUsername"
                    value={emailSettings.smtpUsername}
                    onChange={(e) =>
                      setEmailSettings((prev) => ({
                        ...prev,
                        smtpUsername: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={(e) =>
                      setEmailSettings((prev) => ({
                        ...prev,
                        smtpPassword: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={emailSettings.fromEmail}
                    onChange={(e) =>
                      setEmailSettings((prev) => ({
                        ...prev,
                        fromEmail: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    value={emailSettings.fromName}
                    onChange={(e) =>
                      setEmailSettings((prev) => ({
                        ...prev,
                        fromName: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveEmail} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Email Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Email Verification</Label>
                    <p className="text-sm text-muted-foreground">
                      Users must verify their email before accessing the system
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.requireEmailVerification}
                    onCheckedChange={(checked) =>
                      setSecuritySettings((prev) => ({
                        ...prev,
                        requireEmailVerification: checked,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for all admin accounts
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.enableTwoFactor}
                    onCheckedChange={(checked) =>
                      setSecuritySettings((prev) => ({
                        ...prev,
                        enableTwoFactor: checked,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Strong Passwords</Label>
                    <p className="text-sm text-muted-foreground">
                      Enforce strong password requirements
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.requireStrongPassword}
                    onCheckedChange={(checked) =>
                      setSecuritySettings((prev) => ({
                        ...prev,
                        requireStrongPassword: checked,
                      }))
                    }
                  />
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">
                    Session Timeout (minutes)
                  </Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) =>
                      setSecuritySettings((prev) => ({
                        ...prev,
                        sessionTimeout: Number.parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) =>
                      setSecuritySettings((prev) => ({
                        ...prev,
                        maxLoginAttempts: Number.parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Min Password Length</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={securitySettings.passwordMinLength}
                    onChange={(e) =>
                      setSecuritySettings((prev) => ({
                        ...prev,
                        passwordMinLength: Number.parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveSecurity} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <AdminSettingsPageContent />
    </DashboardLayout>
  );
}
