// src/app/stories/page.tsx
import { createClient } from "@/lib/supabase/server";

export default async function StoriesPage() {
  const supabase = await createClient();

  // Fetch stories
  const { data: stories } = await supabase
    .from("stories")
    .select("*")
    .order("created_at", { ascending: false });

  // Fetch logged-in user
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <div style={{ padding: "2rem" }}>
    <h1 className="text-lg md:text-xl font-medium tracking-wide text-green-400 max-w-3xl leading-relaxed">
      They may not be easy to read, but their stories inspire us to care deeply,
      learn together, and create real positive change.🐾
    </h1>




      {/* Add Story Button (only for logged-in users) */}
      {user && (
        <div style={{ margin: "1rem 0" }}>
          <a
            href="/admin/stories/new"
            style={{
              padding: "0.6rem 1.2rem",
              background: "#0070f3",
              color: "white",
              borderRadius: "6px",
              textDecoration: "none"
            }}
          >
            Add Story
          </a>
        </div>
      )}

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
