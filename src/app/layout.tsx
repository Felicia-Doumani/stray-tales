import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stray Tales",
  description: "A platform for sharing stories of stray animals.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
