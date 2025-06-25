/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AdminSidebar } from "@/components/dashboard/admin-sidebar";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import type { AppDispatch } from "@/store";
import { fetchAdminStats } from "@/store/slices/adminSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
const AnalyticsPageContent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { stats, loading, error } = useSelector((state: any) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="destructive">{error}</Alert>;
  }

  const data =
    stats?.monthlyUsers?.length > 0
      ? [
          {
            name: "Jan",
            users: stats.monthlyUsers[0] || 0,
            products: stats.monthlyProducts[0] || 0,
            orders: stats.monthlyOrders[0] || 0,
          },
          {
            name: "Feb",
            users: stats.monthlyUsers[1] || 0,
            products: stats.monthlyProducts[1] || 0,
            orders: stats.monthlyOrders[1] || 0,
          },
          {
            name: "Mar",
            users: stats.monthlyUsers[2] || 0,
            products: stats.monthlyProducts[2] || 0,
            orders: stats.monthlyOrders[2] || 0,
          },
          {
            name: "Apr",
            users: stats.monthlyUsers[3] || 0,
            products: stats.monthlyProducts[3] || 0,
            orders: stats.monthlyOrders[3] || 0,
          },
          {
            name: "May",
            users: stats.monthlyUsers[4] || 0,
            products: stats.monthlyProducts[4] || 0,
            orders: stats.monthlyOrders[4] || 0,
          },
          {
            name: "Jun",
            users: stats.monthlyUsers[5] || 0,
            products: stats.monthlyProducts[5] || 0,
            orders: stats.monthlyOrders[5] || 0,
          },
          {
            name: "Jul",
            users: stats.monthlyUsers[6] || 0,
            products: stats.monthlyProducts[6] || 0,
            orders: stats.monthlyOrders[6] || 0,
          },
          {
            name: "Aug",
            users: stats.monthlyUsers[7] || 0,
            products: stats.monthlyProducts[7] || 0,
            orders: stats.monthlyOrders[7] || 0,
          },
          {
            name: "Sep",
            users: stats.monthlyUsers[8] || 0,
            products: stats.monthlyProducts[8] || 0,
            orders: stats.monthlyOrders[8] || 0,
          },
          {
            name: "Oct",
            users: stats.monthlyUsers[9] || 0,
            products: stats.monthlyProducts[9] || 0,
            orders: stats.monthlyOrders[9] || 0,
          },
          {
            name: "Nov",
            users: stats.monthlyUsers[10] || 0,
            products: stats.monthlyProducts[10] || 0,
            orders: stats.monthlyOrders[10] || 0,
          },
          {
            name: "Dec",
            users: stats.monthlyUsers[11] || 0,
            products: stats.monthlyProducts[11] || 0,
            orders: stats.monthlyOrders[11] || 0,
          },
        ]
      : [];

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <div className="h-64 w-full">
        <h2 className="mb-2 font-semibold">Monthly Revenue</h2>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="users"
              stackId="1"
              stroke="#8884d8"
              fill="#8884d8"
            />
            <Area
              type="monotone"
              dataKey="products"
              stackId="1"
              stroke="#82ca9d"
              fill="#82ca9d"
            />
            <Area
              type="monotone"
              dataKey="orders"
              stackId="1"
              stroke="#ffc658"
              fill="#ffc658"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="h-64 w-full">
        <h2 className="mb-2 font-semibold">Monthly Sales</h2>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="orders"
              stroke="#8884d8"
              fill="#8884d8"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default function AnalyticsPage() {
  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <AnalyticsPageContent />
    </DashboardLayout>
  );
}
