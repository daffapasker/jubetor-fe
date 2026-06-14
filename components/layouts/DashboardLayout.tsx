"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import DashboardSidebar from "./DashboardSidebar";

interface SidebarItem {
  key: string;
  label: string;
  href: string;
  icon: ReactNode;
}

interface DashboardLayoutProps {
  children: ReactNode;
  sidebarItems: SidebarItem[];
  onLogout?: () => void;
}

export default function DashboardLayout({
  children,
  sidebarItems,
  onLogout,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const activeItem = sidebarItems.find((item) => item.href === pathname);
  const pageTitle = activeItem ? activeItem.label : "Dashboard";

  const isAdmin = pathname.startsWith("/admin");
  const isClient = pathname.startsWith("/client");
  const roleName = isAdmin ? "Admin" : isClient ? "Client" : "";
  const docTitle = `${pageTitle}${roleName ? ` ${roleName}` : ""} | Jubetor`;

  useEffect(() => {
    document.title = docTitle;
  }, [docTitle]);

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <DashboardSidebar items={sidebarItems} onLogout={onLogout} />

      {/* Main content */}
      <main className="pt-14 md:pl-56 md:pt-0">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              {pageTitle}
            </h1>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
