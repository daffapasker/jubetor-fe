"use client";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { SIDEBAR_CLIENT } from "@/constant/sidebarList";
import { useRouter } from "next/navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";
    router.push("/login");
  };

  return (
    <DashboardLayout sidebarItems={SIDEBAR_CLIENT} onLogout={handleLogout}>
      {children}
    </DashboardLayout>
  );
}
