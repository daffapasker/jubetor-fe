"use client";

import React from "react";
import { Controller } from "react-hook-form";
import useLogin from "@/hooks/useLogin";

export default function LoginForm() {
  const { control, errors, handlerSignIn, isPendingSignIn } = useLogin();

  return (
    <form onSubmit={handlerSignIn} className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
          Selamat Datang
        </h2>
        <p className="text-sm text-zinc-400">Masuk ke dashboard JUBETOR</p>
      </div>

      {/* Root Error */}
      {errors.root && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
          {errors.root.message}
        </div>
      )}

      {/* Email Field */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-300">Email</label>
        <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-gray-900/50 px-4 py-3 transition-all focus-within:border-red-500/50 focus-within:bg-gray-900/80 focus-within:shadow-lg focus-within:shadow-red-500/10">
          <span className="shrink-0 text-zinc-500">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </span>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Masukkan email"
                autoComplete="off"
                className="w-full bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
              />
            )}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-400">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-300">Password</label>
        <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-gray-900/50 px-4 py-3 transition-all focus-within:border-red-500/50 focus-within:bg-gray-900/80 focus-within:shadow-lg focus-within:shadow-red-500/10">
          <span className="shrink-0 text-zinc-500">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              <rect x="5" y="11" width="14" height="10" rx="2" />
            </svg>
          </span>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="password"
                placeholder="Masukkan password"
                autoComplete="off"
                className="w-full bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
              />
            )}
          />
        </div>
        {errors.password && (
          <p className="text-xs text-red-400">{errors.password.message}</p>
        )}
      </div>

      {/* Options */}


      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPendingSignIn}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-red-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 shadow-lg shadow-red-500/20"
      >
        {isPendingSignIn ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Masuk...
          </>
        ) : (
          <>
            Masuk
            <span aria-hidden="true">→</span>
          </>
        )}
      </button>

  
    </form>
  );
}