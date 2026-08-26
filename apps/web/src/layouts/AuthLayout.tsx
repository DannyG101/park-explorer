import type { ReactNode } from "react";

import authParkImage from "@/assets/parks/auth-park.jpg";

type AuthLayoutProps = {
  children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <img
        src={authParkImage}
        alt="Israeli park landscape"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-slate-950/45" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">
        <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/85 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Park Explorer
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
              Explore Israel&apos;s parks
            </h1>

            <p className="mt-3 text-base leading-7 text-slate-700">
              Discover parks, nature, and places worth exploring.
            </p>
          </div>

          {children}
        </div>
      </div>
    </main>
  );
}