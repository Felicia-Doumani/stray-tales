// src/app/stories/[id]/page.tsx
import { createClient } from "@/lib/supabase/server";

export default async function StoryPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const supabase = await createClient();   

  const { data: story, error } = await supabase
    .from("stories")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !story) {
    return <div style={{ padding: "2rem" }}>Story not found.</div>;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "0 auto" }}>
      <h1>{story.title}</h1>

      {story.photo_url && (
        <img
          src={story.photo_url}
          alt={story.title}
          style={{
            width: "100%",
            borderRadius: "12px",
            marginTop: "1rem",
            marginBottom: "1.5rem",
          }}
        />
      )}

      <p style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>
        {story.description}
      </p>

      <p style={{ marginTop: "2rem", color: "#777" }}>
        <strong>Date:</strong> {story.story_date}
        <br />
        {story.location && (
          <>
            <strong>Location:</strong> {story.location}
          </>
        )}
      </p>
    </div>
  );
}
