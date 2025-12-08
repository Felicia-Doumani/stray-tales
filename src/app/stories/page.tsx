// src/app/stories/page.tsx
import { createClient } from "@/lib/supabase/server";

export default async function StoriesPage() {
  const supabase = await createClient();
  const { data: stories } = await supabase
    .from("stories")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Stories</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1.5rem",
          marginTop: "2rem",
        }}
      >
        {stories?.map((story) => (
          <a
            key={story.id}
            href={`/stories/${story.id}`}
            style={{
              textDecoration: "none",
              color: "inherit",
              border: "1px solid #ddd",
              borderRadius: "10px",
              overflow: "hidden",
              display: "block",
            }}
          >
            <img
              src={story.photo_url}
              alt={story.title}
              style={{ width: "100%", height: "200px", objectFit: "cover" }}
            />

            <div style={{ padding: "1rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.2rem" }}>{story.title}</h2>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
