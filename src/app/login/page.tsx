// src/app/login/page.tsx
import { login } from "@/app/actions/login";

export default function LoginPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Login</h1>

      <form action={login} style={{ display: "flex", flexDirection: "column", width: "250px" }}>
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}
