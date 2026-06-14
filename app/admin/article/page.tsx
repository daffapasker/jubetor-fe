"use client";

import ArticleAdmin from "@/components/views/Article/ArticleAdmin";
import { Suspense } from "react";

export default function AdminArticlePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ArticleAdmin />
    </Suspense>
  );
}
