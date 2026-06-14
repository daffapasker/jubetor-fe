"use client";

import { HeroUIProvider } from "@heroui/react";
import AuthProvider from "@/context/AuthProvider";
import { queryClient } from "@/lib/react-query";
import { QueryClientProvider } from "@tanstack/react-query";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <HeroUIProvider>
          {children}
        </HeroUIProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}