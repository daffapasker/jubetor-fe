import React from "react";
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-900 to-black flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-gray-900 to-black pointer-events-none" />

      {/* Decorative Blurs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-4xl bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm bg-gray-900/40 border border-gray-800">

          {/* Left Section - Branding */}
          <section className="w-full lg:w-1/2 p-6 sm:p-8 md:p-10 lg:p-12 flex content-center justify-center  lg:text-left lg:items-center bg-black">
            {/* Logo */}
            <Image
              alt="Jubetor Logo"
              width={300}
              height={300}
              className="rounded-full object-cover mb-6"
              src="/jubetor_logo.jpg"
            />

           
          </section>

          {/* Right Section - Form Panel */}
          <section className="w-full lg:w-1/2 bg-gray-900/30 backdrop-blur-sm p-6 sm:p-8 md:p-10 border-l border-gray-800">
            <div className="w-full max-w-md mx-auto">
              {children}
            </div>

           
          </section>
        </div>
      </div>
    </div>
  );
}