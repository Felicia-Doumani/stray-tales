// src/app/actions/createStory.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createStory(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;
  const location = formData.get("location") as string;
  const note = formData.get("note") as string;
  const status = Number(formData.get("status"));
  const photo_url = formData.get("photo_url") as string;

  const { data, error } = await supabase
    .from("stories")
    .insert({
      title,
      description,
      story_date: date,
      location,
      note,
      status_id: status,
      photo_url,
      user_id: user.id,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  redirect(`/stories/${data.id}`);
}
