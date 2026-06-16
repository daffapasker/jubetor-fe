"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { CiLogout, CiMenuBurger } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";

interface SidebarItem {
  key: string;
  label: string;
  href: string;
  icon: ReactNode;
}

interface DashboardSidebarProps {
  items: SidebarItem[];
  onLogout?: () => void;
}

export default function DashboardSidebar({
  items,
  onLogout,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* ── Mobile top bar ── */}
      <div className="fixed top-0 right-0 left-0 z-40 flex items-center justify-center border-b border-neutral-800 bg-neutral-950 px-4 py-3 md:hidden">
        <h1 className="text-lg font-bold text-red-600">Jubetor ID</h1>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="absolute right-4 rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-800"
          aria-label="Open menu"
        >
          <CiMenuBurger size={24} />
        </button>
      </div>

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
            />

            <motion.aside
              className="fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-neutral-800 bg-neutral-950 shadow-xl md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Close button */}
              <div className="relative flex items-center justify-center px-5 pt-5 pb-2">
                <span className="text-xl font-bold tracking-tight text-red-600">
                  Jubetor ID
                </span>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="absolute right-5 rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-800"
                  aria-label="Close menu"
                >
                  <IoCloseOutline size={24} />
                </button>
              </div>

              {/* Nav items */}
              <nav className="mt-4 flex flex-1 flex-col gap-1 px-3">
                {items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                          : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Logout */}
              {onLogout && (
                <div className="border-t border-neutral-800 p-3">
                  <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-600/10"
                  >
                    <CiLogout size={18} />
                    Logout
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Desktop sidebar ── */}
      <aside className="fixed top-0 bottom-0 left-0 z-30 hidden w-56 flex-col border-r border-neutral-800 bg-neutral-950 md:flex">
        {/* Logo */}
        <div className="flex justify-center px-5 pt-5 pb-2">
          <span className="text-xl font-bold tracking-tight text-red-600">
            Jubetor ID
          </span>
        </div>

        {/* Nav items */}
        <nav className="mt-4 flex flex-1 flex-col gap-1 px-3">
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        {onLogout && (
          <div className="border-t border-neutral-800 p-3">
            <button
              onClick={onLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-600/10"
            >
              <CiLogout size={18} />
              Logout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
