// src/app/stories/[id]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export async function deleteStory(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const supabase = await createClient();
  await supabase.from("stories").delete().eq("id", id);
  redirect("/stories");
}

export default async function StoryPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: story } = await supabase
    .from("stories")
    .select("*")
    .eq("id", id)
    .single();

  if (!story) redirect("/stories");

  const { data: images } = await supabase
    .from("story_images")
    .select("id, image_url")
    .eq("story_id", id)
    .neq("image_url", story.photo_url)
    .order("created_at", { ascending: true });

  const isOwner = user && user.id === story.user_id;

  return (
    <div style={{ padding: "2rem", maxWidth: "1100px", margin: "0 auto" }}>
      <Link href="/stories">Back</Link>

      <h1 style={{ marginTop: "0.5rem" }}>{story.title}</h1>

      {/* DATE + LOCATION */}
      <p style={{ color: "#666", fontSize: "0.85rem", marginBottom: "1rem" }}>
        {new Date(story.story_date).toLocaleDateString()}
        {story.location && ` • ${story.location}`}
      </p>

      {/* MAIN IMAGE + ACTIONS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "480px auto",
          gap: "1.5rem",
          alignItems: "start",
        }}
      >
        <Image
          src={story.photo_url}
          alt={story.title}
          width={480}
          height={480}
          style={{ width: "100%", height: "auto", borderRadius: "12px" }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem",alignItems: "flex-start" }}>
          {story.donation_url && (
            <a
              href={story.donation_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "0.35rem 0.75rem",
                background: "#ffc439",
                borderRadius: "5px",
                fontWeight: 600,
                fontSize: "0.8rem",
                textAlign: "center",
                textDecoration: "none",
                color: "#111",
              }}
            >
              Donate via PayPal
            </a>
          )}

          {isOwner && (
            <>
              <Link
                href={`/admin/stories/edit/${id}`}
                style={{
                  padding: "0.35rem 0.75rem",
                  background: "#2563eb",
                  color: "white",
                  borderRadius: "5px",
                  fontSize: "0.8rem",
                  textAlign: "center",
                  textDecoration: "none",
                }}
              >
                Edit
              </Link>

              <form action={deleteStory}>
                <input type="hidden" name="id" value={story.id} />
                <button
                  style={{
                    padding: "0.35rem 0.75rem",
                    background: "red",
                    color: "white",
                    borderRadius: "5px",
                    fontSize: "0.8rem",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* EXTRA IMAGES */}
      {images && images.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1rem",
            marginTop: "2rem",
          }}
        >
          {images.map((img) => (
            <Image
              key={img.id}
              src={img.image_url}
              alt="Extra image"
              width={300}
              height={300}
              style={{ width: "100%", height: "auto", borderRadius: "8px" }}
            />
          ))}
        </div>
      )}

      <p style={{ marginTop: "2rem", whiteSpace: "pre-line", lineHeight: "1.6" }}>
        {story.description}
      </p>
    </div>
  );
}
