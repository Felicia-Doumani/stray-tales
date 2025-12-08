import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/* -------------------- SERVER ACTION -------------------- */

export async function createStory(formData: FormData) {
  "use server";

  // Create SSR client inside the Server Action
  const supabase = await createClient();

  // Read the admin user ID sent from the hidden field
  const userId = formData.get("user_id") as string;

  if (!userId) {
    throw new Error("Missing user_id. Authentication failed.");
  }

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

  // Extract all inputs
  const fields = Object.fromEntries(formData.entries());
  const title = fields.title as string;
  const description = fields.description as string;
  const date = fields.date as string;
  const location = fields.location as string;
  const note = fields.note as string;
  const status = Number(fields.status);

  // Insert the story with the correct user_id
  const { error } = await supabase.from("stories").insert({
    title: title,
    description: description,
    story_date: date,
    location: location,
    note: note,
    status_id: status,
    photo_url: urlData.publicUrl,
    user_id: userId   // <-- REQUIRED BY YOUR DB
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/admin/stories");
}

/* -------------------- PAGE COMPONENT -------------------- */

export default async function NewStoryPage() {
  // Create the SSR Supabase client for server-side auth check
  const supabase = await createClient();

  // Get logged-in user
  const {
    data: { user }
  } = await supabase.auth.getUser();

  // Block access if no user is logged in
  if (!user) {
    redirect("/login");
  }

  // Extract user_id to send to the server action
  const userId = user.id;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Create New Story</h1>

      {/* Hidden user_id ensures the insert succeeds safely */}
      <form action={createStory}>
        <input type="hidden" name="user_id" value={userId} />

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
