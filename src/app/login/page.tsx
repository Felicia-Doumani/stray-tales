"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    // Wait for the proxy to refresh the session cookies
    await supabase.auth.getSession();

    router.push("/stories");
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Login</h1>

      <form
        onSubmit={handleLogin}
        style={{ display: "flex", flexDirection: "column", width: "250px" }}
      >
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: "10px" }}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: "10px" }}
        />

        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}
