"use client";

import { cn } from "@/lib/utils";
import {
  Calendar,
  CreditCard,
  LayoutDashboard,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard/user",
    icon: LayoutDashboard,
  },
  {
    title: "My Bookings",
    href: "/dashboard/user/bookings",
    icon: Calendar,
  },
  {
    title: "Payment Info",
    href: "/dashboard/user/payments",
    icon: CreditCard,
  },
  {
    title: "Registration Info",
    href: "/dashboard/user/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/dashboard/user/settings",
    icon: Settings,
  },
];

export function UserSidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          User Dashboard
        </h2>
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "transparent"
              )}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
