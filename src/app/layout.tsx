// src/app/layout.tsx
import "./globals.css";
import Link from "next/link";
import React from "react";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/logout";

export const metadata = {
  title: "Stray Tales",
  description: "An independent space for sharing real stories about animals in Samos"
};

export const dynamic = "force-dynamic";

export default async function RootLayout(props: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
        {/* NAVBAR */}
        <nav className="w-full bg-gray-900 text-white border-b border-gray-800">
          <div className="w-full px-6 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="text-lg font-semibold tracking-wide hover:text-gray-300 transition"
            >
              Animal Voices
            </Link>

            <div className="flex items-center gap-6 text-sm">
              <Link href="/stories" className="hover:text-gray-300 transition">
                Stories
              </Link>

              {user && (
                <form action={logout}>
                  <button type="submit" className="hover:text-red-400 transition">
                    Logout
                  </button>
                </form>
              )}
            </div>
          </div>
        </nav>



        {/* MAIN */}
        <main className="flex-1 w-full">
          {props.children}
        </main>

        {/* FOOTER */}
        <footer className="w-full bg-gray-900 text-gray-300 flex justify-center">
          <div className="w-full max-w-6xl px-6 py-10 flex flex-col items-center text-center gap-4">
            <p className="text-xs leading-relaxed max-w-3xl">
              Donations are made via PayPal links provided per story and go directly
              to the volunteer, veterinarian, or shelter involved. Stray Tales does
              not collect, handle, or manage any funds.
            </p>

            <p className="text-sm">
              Contact:{" "}
              <a
                href="mailto:straytales.samos@gmail.com"
                className="underline hover:text-white transition"
              >
                straytales.samos@gmail.com
              </a>
            </p>

            <p className="text-xs text-gray-500">
              A shared space shaped by real experiences.
            </p>
          </div>
        </footer>



      </body>
    </html>
  );
}
