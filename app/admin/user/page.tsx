"use client";

import UserAdmin from "@/components/views/User/UserAdmin";
import { Suspense } from "react";

export default function AdminUserPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserAdmin />
    </Suspense>
  );
}