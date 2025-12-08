// src/app/stories/[id]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/* -------------------- DELETE SERVER ACTION -------------------- */
export async function deleteStory(formData: FormData) {
  "use server";

  const id = formData.get("id") as string;

  const supabase = await createClient();

  // RLS ensures only the owner can delete
  const { error } = await supabase
    .from("stories")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  redirect("/stories"); // go back to list
}

/* -------------------- PAGE -------------------- */
export default async function StoryPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const supabase = await createClient();

  // Fetch story
  const { data: story } = await supabase
    .from("stories")
    .select("*")
    .eq("id", id)
    .single();

  // Fetch logged-in user
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const isOwner = user && user.id === story.user_id;

  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "0 auto" }}>
      <h1>{story.title}</h1>

      <img
        src={story.photo_url}
        alt={story.title}
        style={{
          width: "100%",
          borderRadius: "12px",
          margin: "1rem 0 1.5rem 0",
        }}
      />

      <p style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>
        {story.description}
      </p>

      {isOwner && (
        <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
          <a
            href={`/admin/stories/edit/${id}`}
            style={{
              padding: "0.5rem 1rem",
              background: "#0070f3",
              color: "white",
              borderRadius: "6px",
            }}
          >
            Edit
          </a>

          {/*  Delete button with server action */}
          <form action={deleteStory}>
            <input type="hidden" name="id" value={story.id} />
            <button
              style={{
                padding: "0.5rem 1rem",
                background: "red",
                color: "white",
                borderRadius: "6px",
              }}
            >
              Delete
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
