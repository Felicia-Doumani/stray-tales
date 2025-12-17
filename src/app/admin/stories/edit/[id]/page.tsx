import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ExtraImagesUploader from "./ExtraImagesUploader";

export async function updateStory(formData: FormData) {
  "use server";

  const id = formData.get("id") as string;

  const supabase = await createClient();

  await supabase
    .from("stories")
    .update({
      title: formData.get("title"),
      description: formData.get("description"),
      story_date: formData.get("date"),
      location: formData.get("location"),
      note: formData.get("note"),
      status_id: Number(formData.get("status")),
      donation_url: formData.get("donation_url") || null,
    })
    .eq("id", id);

  const extraImages = formData.getAll("extra_images") as string[];
  if (extraImages.length > 0) {
    await supabase.from("story_images").insert(
      extraImages.map((url) => ({
        story_id: id,
        image_url: url,
      }))
    );
  }

  redirect(`/stories/${id}`);
}

export default async function EditStoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: story } = await supabase
    .from("stories")
    .select("*")
    .eq("id", id)
    .single();

  const { data: images } = await supabase
    .from("story_images")
    .select("*")
    .eq("story_id", id);

  if (!story) return <div>Story not found</div>;

  const inputStyle = {
    width: "100%",
    padding: "0.65rem",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
  };

  return (
    <div
      style={{
        maxWidth: "720px",
        margin: "3rem auto",
        padding: "2rem",
        background: "#fff",
        borderRadius: "14px",
        boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
      }}
    >
      <h1 style={{ marginBottom: "1.5rem" }}>Edit story</h1>

      <form
        action={updateStory}
        style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}
      >
        <input type="hidden" name="id" value={id} />

        <div>
          <label>Title</label>
          <input name="title" defaultValue={story.title} required style={inputStyle} />
        </div>

        <div>
          <label>Description</label>
          <textarea
            name="description"
            rows={5}
            defaultValue={story.description}
            required
            style={inputStyle}
          />
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ flex: 1 }}>
            <label>Date</label>
            <input type="date" name="date" defaultValue={story.story_date} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Location</label>
            <input name="location" defaultValue={story.location || ""} style={inputStyle} />
          </div>
        </div>

        <div>
          <label>Internal note</label>
          <input name="note" defaultValue={story.note || ""} style={inputStyle} />
        </div>

        <div>
          <label>Donation URL</label>
          <input name="donation_url" defaultValue={story.donation_url || ""} style={inputStyle} />
        </div>

        <div>
          <label>Status</label>
          <select name="status" defaultValue={story.status_id} style={inputStyle}>
            <option value="1">Looking for a home</option>
            <option value="2">In foster care</option>
            <option value="3">Adopted</option>
            <option value="4">Back on the streets</option>
            <option value="5">Missing</option>
            <option value="6">In treatment / recovering</option>
            <option value="7">Gone </option>
          </select>
        </div>

        {images && images.length > 0 && (
          <div>
            <label>Existing images</label>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
              {images.map((img) => (
                <img
                  key={img.id}
                  src={img.image_url}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <ExtraImagesUploader />

        <button
          type="submit"
          style={{
            marginTop: "1.5rem",
            padding: "0.85rem",
            background: "#111",
            color: "#fff",
            borderRadius: "10px",
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Save changes
        </button>
      </form>
    </div>
  );
}
