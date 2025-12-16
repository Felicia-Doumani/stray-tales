// src/app/layout.tsx
import "./globals.css";
import Link from "next/link";
import React from "react";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/logout";

export const metadata = {
  title: "Stray Tales",
  description: "Stories of stray animals in Samos",
};
export const dynamic = "force-dynamic";
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-white text-gray-800">

        {/* NAVBAR */}
        <nav className="w-full bg-gray-900 text-white shadow-lg">
          <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
            <div className="text-xl font-bold tracking-wide">
              Stray Tales
            </div>

            <div className="flex items-center gap-10">
              <Link
                href="/"
                className="text-white text-lg font-semibold hover:text-gray-300 transition-colors"
              >
                About
              </Link>

              <Link
                href="/stories"
                className="text-white text-lg font-semibold hover:text-gray-300 transition-colors"
              >
                Stories
              </Link>

              {user && (
                <form action={logout}>
                  <button
                    type="submit"
                    className="text-white text-lg font-semibold hover:text-red-400 transition-colors"
                  >
                    Logout
                  </button>
                </form>
              )}
            </div>
          </div>
        </nav>

        {/* PAGE CONTENT */}
        <main className="flex-1 flex items-start justify-center bg-gray-50">
          <div className="w-full max-w-3xl bg-white shadow-sm rounded-xl p-8 mt-10">
            {children}
          </div>
        </main>

        {/* FOOTER */}
        <footer className="px-6 py-4 bg-gray-900 text-white text-center">
          <p className="m-0">Contact: straytales.samos@gmail.com</p>
        </footer>

      </body>
    </html>
  );
}
