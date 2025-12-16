// src/app/admin/stories/edit/[id]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/* -------------------- UPDATE SERVER ACTION -------------------- */
export async function updateStory(formData: FormData) {
  "use server";

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;
  const location = formData.get("location") as string;
  const note = formData.get("note") as string;
  const status = Number(formData.get("status"));
  const donation_url = formData.get("donation_url") as string;

  const supabase = await createClient();

  const { error } = await supabase
    .from("stories")
    .update({
      title,
      description,
      story_date: date,
      location,
      note,
      status_id: status,
      donation_url: donation_url || null
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  redirect(`/stories/${id}`);
}

/* -------------------- PAGE -------------------- */
export default async function EditStoryPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: story } = await supabase
    .from("stories")
    .select("*")
    .eq("id", id)
    .single();

  if (!story) {
    return <div style={{ padding: "2rem" }}>Story not found.</div>;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Edit Story</h1>

      <form action={updateStory} style={{ marginTop: "1.5rem" }}>
        <input type="hidden" name="id" value={id} />

        <label style={{ fontWeight: "bold" }}>Title</label>
        <input
          type="text"
          name="title"
          defaultValue={story.title}
          required
          style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        />

        <label style={{ fontWeight: "bold" }}>Description</label>
        <textarea
          name="description"
          defaultValue={story.description}
          required
          style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        />

        <label style={{ fontWeight: "bold" }}>Date</label>
        <input
          type="date"
          name="date"
          defaultValue={story.story_date}
          required
          style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        />

        <label style={{ fontWeight: "bold" }}>Location</label>
        <input
          type="text"
          name="location"
          defaultValue={story.location || ""}
          style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        />

        <label style={{ fontWeight: "bold" }}>Note</label>
        <input
          type="text"
          name="note"
          defaultValue={story.note || ""}
          style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        />

        {/* NEW: DONATION URL */}
        <label style={{ fontWeight: "bold" }}>PayPal Donation URL</label>
        <input
          type="url"
          name="donation_url"
          placeholder="https://www.paypal.me/username"
          defaultValue={story.donation_url || ""}
          style={{ width: "100%", marginBottom: "1.5rem", padding: "0.5rem" }}
        />

        <label style={{ fontWeight: "bold" }}>Status</label>
        <select
          name="status"
          defaultValue={story.status_id}
          style={{ width: "100%", marginBottom: "1.5rem", padding: "0.5rem" }}
        >
          <option value="1">Pending</option>
          <option value="2">Published</option>
          <option value="3">Archived</option>
        </select>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.75rem",
            background: "#0070f3",
            color: "white",
            borderRadius: "6px",
          }}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
