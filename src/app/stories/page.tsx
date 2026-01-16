// src/app/stories/page.tsx
import { createClient } from "@/lib/supabase/server";

export default async function StoriesPage() {
  const supabase = await createClient();

  const { data: stories } = await supabase
    .from("stories")
    .select("*")
    .order("created_at", { ascending: false });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div style={{ padding: "2rem" }}>

      <h1 className="text-lg md:text-xl font-medium tracking-wide text-green-700 max-w-2xl leading-relaxed">
        Their stories may be difficult to read, but they inspire us to care more deeply, learn together, and take meaningful action toward real, positive change.🐾
      </h1>

      {user && (
        <div style={{ margin: "1rem 0" }}>
          <a
            href="/admin/stories/new"
            style={{
              padding: "0.6rem 1.2rem",
              background: "#0070f3",
              color: "white",
              borderRadius: "6px",
              textDecoration: "none",
            }}
          >
            Add Story
          </a>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "1.2rem",
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
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "1 / 1",
                overflow: "hidden",
              }}
            >
              <img
                src={story.photo_url}
                alt={story.title}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            <div style={{ padding: "0.7rem" }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: "0.95rem",
                  lineHeight: "1.3",
                }}
              >
                {story.title}
              </h2>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
