"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(formData: FormData) {
    setError(null);
    setLoading(true);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      // IMPORTANT: show the REAL Supabase error
      setError(error.message);
      return;
    }

    if (!data.session) {
      setError("No session returned from Supabase");
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
          <p style={{ color: "red", marginBottom: "1rem" }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
