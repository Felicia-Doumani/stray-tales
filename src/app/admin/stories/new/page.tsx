// src/app/admin/stories/new/page.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { createStory } from "@/app/actions/createStory";

export default function NewStoryPage() {
  const supabase = createClient();

  const [mainImageUrl, setMainImageUrl] = useState<string | null>(null);
  const [extraImageUrls, setExtraImageUrls] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  async function uploadImage(file: File): Promise<string> {
    const filePath = `${crypto.randomUUID()}-${file.name}`;
    const { error } = await supabase.storage
      .from("stories-photos")
      .upload(filePath, file);
    if (error) throw error;
    const { data } = supabase.storage
      .from("stories-photos")
      .getPublicUrl(filePath);
    return data.publicUrl;
  }

  async function handleMainImage(file: File) {
    try {
      setError("");
      setMainImageUrl(await uploadImage(file));
    } catch (e) {
      if (e instanceof Error) setError(e.message);
    }
  }

  async function handleExtraImages(files: FileList) {
    try {
      setError("");
      const urls = await Promise.all(Array.from(files).map(uploadImage));
      setExtraImageUrls((prev) => [...prev, ...urls]);
    } catch (e) {
      if (e instanceof Error) setError(e.message);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "0.65rem",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
  };

  const uploadCardStyle = {
    display: "block",
    width: "100%",
    border: "2px dashed #d1d5db",
    borderRadius: "12px",
    padding: "1.5rem",
    textAlign: "center" as const,
    cursor: "pointer",
    background: "#fafafa",
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
      <h1 style={{ marginBottom: "1.5rem" }}>Create new story</h1>

      <form
        action={createStory}
        style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
      >
        <div>
          <label>Title</label>
          <input name="title" required style={inputStyle} />
        </div>

        <div>
          <label>Description</label>
          <textarea name="description" rows={5} required style={inputStyle} />
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ flex: 1 }}>
            <label>Date</label>
            <input type="date" name="date" required style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Location</label>
            <input name="location" style={inputStyle} />
          </div>
        </div>

        <div>
          <label>Internal note (admin)</label>
          <input name="note" style={inputStyle} />
        </div>

        <div>
          <label>Donation URL (optional)</label>
          <input type="url" name="donation_url" style={inputStyle} />
        </div>

        <div>
          <label>Status</label>
          <select name="status" style={inputStyle}>
            <option value="1">Looking for a home</option>
            <option value="2">In foster care</option>
            <option value="3">Adopted</option>
            <option value="4">Back on the streets</option>
            <option value="5">Missing</option>
            <option value="6">In treatment / recovering</option>
            <option value="7">Gone (deceased)</option>
          </select>
        </div>

        {/* MAIN IMAGE */}
        <div>
          <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 500 }}>
            Main image
          </label>

          <label style={uploadCardStyle}>
            <strong style={{ display: "block", marginBottom: "0.25rem" }}>
              Upload main image
            </strong>
            <span style={{ fontSize: "0.85rem", color: "#666" }}>
              This will be the cover photo of the story
            </span>

            <input
              type="file"
              accept="image/*"
              required
              style={{ display: "none" }}
              onChange={(e) =>
                e.target.files && handleMainImage(e.target.files[0])
              }
            />
          </label>

          {mainImageUrl && (
            <img
              src={mainImageUrl}
              alt="Main preview"
              style={{
                marginTop: "0.75rem",
                width: "180px",
                borderRadius: "10px",
                display: "block",
              }}
            />
          )}
        </div>

        {/* EXTRA IMAGES */}
        <div>
          <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 500 }}>
            Extra images
          </label>

          <label style={uploadCardStyle}>
            <strong style={{ display: "block", marginBottom: "0.25rem" }}>
              Upload extra images
            </strong>
            <span style={{ fontSize: "0.85rem", color: "#666" }}>
              You can select multiple photos
            </span>

            <input
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={(e) =>
                e.target.files && handleExtraImages(e.target.files)
              }
            />
          </label>

          {extraImageUrls.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                marginTop: "0.75rem",
                flexWrap: "wrap",
              }}
            >
              {extraImageUrls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt="Extra preview"
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {mainImageUrl && (
          <input type="hidden" name="photo_url" value={mainImageUrl} />
        )}
        {extraImageUrls.map((url, i) => (
          <input key={i} type="hidden" name="extra_images" value={url} />
        ))}

        {error && <p style={{ color: "#dc2626" }}>{error}</p>}

        <button
          type="submit"
          disabled={!mainImageUrl}
          style={{
            marginTop: "1rem",
            padding: "0.85rem",
            background: "#111",
            color: "#fff",
            borderRadius: "10px",
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
            opacity: mainImageUrl ? 1 : 0.6,
          }}
        >
          Create story
        </button>
      </form>
    </div>
  );
}
