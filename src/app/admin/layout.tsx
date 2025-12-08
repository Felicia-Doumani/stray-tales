import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  // SSR-safe auth check
  // checks Supabase auth once and redirects if the user is not logged in, so every /admin/* page is automatically protected without repeating code
  const { data: claims } = await supabase.auth.getClaims();

  if (!claims) {
    redirect("/login");
  }

  return (
    <div>
      {children}
    </div>
  );
}
