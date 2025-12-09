// src/app/layout.tsx
import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Stray Tales",
  description: "Stories of stray animals in Samos"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: "#ffffff",
          color: "#222"
        }}
      >
        {/* NAVBAR */}
        <nav
          style={{
            display: "flex",
            gap: "2rem",
            padding: "1rem 2rem",
            backgroundColor: "#222",
            color: "white",
            alignItems: "center"
          }}
        >
          <Link
            href="/"
            style={{
              textDecoration: "none",
              color: "white",
              fontWeight: "bold"
            }}
          >
            About
          </Link>

          <Link
            href="/stories"
            style={{
              textDecoration: "none",
              color: "white",
              fontWeight: "bold"
            }}
          >
            Stories
          </Link>
        </nav>

        {/* PAGE CONTENT */}
        <div style={{ flex: 1 }}>
          {children}
        </div>

        {/* FOOTER */}
        <footer
          style={{
            padding: "1rem 2rem",
            backgroundColor: "#222",
            color: "white",
            textAlign: "center"
          }}
        >
          <p style={{ margin: 0 }}>
            Contact: straytales.samos@gmail.com
          </p>
        </footer>
      </body>
    </html>
  );
}
