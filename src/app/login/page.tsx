// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [error, setError] = useState<string>("");

  async function handleLogin(formData: FormData) {
    setError("");

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Invalid email or password");
      return;
    }

    router.push("/stories");
    router.refresh();
  }

  return (
    <div style={{ maxWidth: "400px", margin: "4rem auto" }}>
      <h1>Sign in</h1>

      <form action={handleLogin}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          style={{ display: "block", width: "100%", marginBottom: "1rem" }}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          style={{ display: "block", width: "100%", marginBottom: "1rem" }}
        />

        {error && (
          <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>
        )}

        <button type="submit" style={{ width: "100%" }}>
          Sign in
        </button>
      </form>
    </div>
  );
}
