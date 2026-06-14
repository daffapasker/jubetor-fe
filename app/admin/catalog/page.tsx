"use client";

import CatalogAdmin from "@/components/views/Catalog/CatalogAdmin";
import { Suspense } from "react";

export default function AdminCatalogPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CatalogAdmin />
    </Suspense>
  );
}
