import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/* -------------------- SERVER ACTION -------------------- */

export async function createStory(formData: FormData) {
  "use server";

  const supabase = await createClient();

  // Proper SSR user check
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const userId = user.id; // <-- always use the authenticated user

  // Handle file upload
  const file = formData.get("photo") as File;
  const filePath = `${crypto.randomUUID()}-${file.name}`;

  const upload = await supabase.storage
    .from("stories-photos")
    .upload(filePath, file);

  if (upload.error) {
    throw new Error(upload.error.message);
  }

  const { data: urlData } = supabase.storage
    .from("stories-photos")
    .getPublicUrl(filePath);

  // Extract form fields
  const fields = Object.fromEntries(formData.entries());
  const title = fields.title as string;
  const description = fields.description as string;
  const date = fields.date as string;
  const location = fields.location as string;
  const note = fields.note as string;
  const status = Number(fields.status);

  // Insert story
  const { data, error } = await supabase
    .from("stories")
    .insert({
      title,
      description,
      story_date: date,
      location,
      note,
      status_id: status,
      photo_url: urlData.publicUrl,
      user_id: userId
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/stories/${data.id}`);
}

/* -------------------- PAGE COMPONENT -------------------- */

export default async function NewStoryPage() {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Create New Story</h1>

      <form action={createStory}>
        <input type="text" name="title" placeholder="Title" required />
        <br />

        <textarea name="description" placeholder="Description" required />
        <br />

        <input type="date" name="date" required />
        <br />

        <input type="text" name="location" placeholder="Location" />
        <br />

        <input type="text" name="note" placeholder="Note" />
        <br />

        <select name="status">
          <option value="1">Pending</option>
          <option value="2">Published</option>
          <option value="3">Archived</option>
        </select>
        <br />

        <input type="file" name="photo" accept="image/*" required />
        <br />

        <button type="submit">Create Story</button>
      </form>
    </div>
  );
}
