// src/app/layout.tsx
import "./globals.css";
import Link from "next/link";
import React from "react";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/logout";

export const metadata = {
  title: "Stray Tales",
  description: "An independent space for sharing real stories about animals in Samos",
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
          <div className="w-full h-16 flex items-center px-6 relative">
            {/* LEFT GROUP */}
            <div className="flex items-center gap-6 ml-8">
              <Link
                href="/"
                className="text-lg font-semibold tracking-wide hover:text-gray-300 transition"
              >
                Animal Voices
              </Link>

            <Link
              href="/stories"
              className="text-lg font-semibold tracking-wide hover:text-gray-300 transition"
            >
              Stories
            </Link>

            </div>

            {/* SUPER RIGHT CORNER */}
            {user && (
              <form
                action={logout}
                className="absolute right-6 top-1/2 -translate-y-1/2"
              >
                <button
                  type="submit"
                  className="text-sm hover:text-red-400 transition"
                >
                  Logout
                </button>
              </form>
            )}
          </div>
        </nav>

        {/* MAIN */}
        <main className="flex-1 w-full">{props.children}</main>

        {/* FOOTER */}
        <footer className="w-full bg-gray-900 text-gray-300 flex justify-center">
          <div className="w-full max-w-6xl px-6 py-10 flex flex-col items-center text-center gap-4">
            <p className="text-xs leading-relaxed max-w-3xl">
              Donations are made via PayPal links provided per story and go directly
              to the volunteer, veterinarian, or shelter involved. 
              <br /> We do not collect, handle, or manage any funds.
            </p>

            <p className="text-sm">
              Contact:{" "}
              <a
                href="mailto:animal.voices.samos@gmail.com"
                className="underline hover:text-white transition"
              >
                animal.voices.samos@gmail.com
              </a>
            </p>

            <p className="text-xs">
              Samos, Greece.
            </p>

          </div>
        </footer>

      </body>
    </html>
  );
}
