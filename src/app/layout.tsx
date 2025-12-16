// src/app/layout.tsx
import "./globals.css";
import Link from "next/link";
import React from "react";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/logout";

export const metadata = {
  title: "Stray Tales",
  description: "Stories of stray animals in Samos"
};

export const dynamic = "force-dynamic";

export default async function RootLayout(props: { children: React.ReactNode }) {
  const supabase = await createClient();
  const result = await supabase.auth.getUser();
  const user = result.data.user;

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
        <nav className="w-full bg-gray-900 text-white shadow-lg">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-wide hover:text-gray-300">
              Stray Tales
            </Link>

            <div className="flex items-center gap-8">
              <Link href="/stories" className="text-lg font-semibold hover:text-gray-300">
                Stories
              </Link>

              {user ? (
                <form action={logout}>
                  <button
                    type="submit"
                    className="text-lg font-semibold hover:text-red-400"
                  >
                    Logout
                  </button>
                </form>
              ) : null}
            </div>
          </div>
        </nav>

        <main className="flex-1 w-full bg-gray-50">
          {props.children}
        </main>

        <footer className="w-full bg-gray-900 text-white">
            <p className="mt-2 text-xs text-gray-400">
              Donations are made via PayPal links provided per story and go directly to the volunteer,
              veterinarian, or shelter involved. Stray Tales does not collect or manage any funds.
            </p>

          <div className="max-w-6xl mx-auto px-6 py-4 text-center text-sm">
            Contact: straytales.samos@gmail.com
          </div>
        </footer>
      </body>
    </html>
  );
}
