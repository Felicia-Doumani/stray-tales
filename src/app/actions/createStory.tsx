// src/app/actions/createStory.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createStory(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const photo_url = formData.get("photo_url") as string;
  const story_date = formData.get("date") as string;
  const location = formData.get("location") as string | null;
  const note = formData.get("note") as string | null;
  const donation_url = formData.get("donation_url") as string | null;
  const status_id = Number(formData.get("status"));

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  // 1) Insert story
  const { data: story, error } = await supabase
    .from("stories")
    .insert({
      title,
      description,
      photo_url,
      story_date,
      location,
      note,
      donation_url,
      status_id,
      user_id: user.id,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  // 2) Insert extra images (if any)
  const extraImages = formData.getAll("extra_images") as string[];

  if (extraImages.length > 0) {
    const rows = extraImages.map((url) => ({
      story_id: story.id,
      image_url: url,
    }));

    const { error: imagesError } = await supabase
      .from("story_images")
      .insert(rows);

    if (imagesError) throw new Error(imagesError.message);
  }

  // 3) Redirect to story page
  redirect(`/stories/${story.id}`);
}
