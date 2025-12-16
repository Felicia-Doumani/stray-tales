// src/app/admin/stories/new/page.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { createStory } from "@/app/actions/createStory";

export default function NewStoryPage() {
  const supabase = createClient();

  const [mainImageUrl, setMainImageUrl] = useState<string | null>(null);
  const [extraImageUrls, setExtraImageUrls] = useState<string[]>([]);
  const [error, setError] = useState("");

  async function uploadImage(file: File): Promise<string> {
    const filePath = `${crypto.randomUUID()}-${file.name}`;

    const { error } = await supabase.storage
      .from("stories-photos")
      .upload(filePath, file);

    if (error) throw new Error(error.message);

    const { data } = supabase.storage
      .from("stories-photos")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function handleMainImage(file: File) {
    setError("");
    try {
      const url = await uploadImage(file);
      setMainImageUrl(url);
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function handleExtraImages(files: FileList) {
    setError("");
    try {
      const uploads = Array.from(files).map(uploadImage);
      const urls = await Promise.all(uploads);
      setExtraImageUrls((prev) => [...prev, ...urls]);
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Create New Story</h1>

      <form action={createStory}>
        <input name="title" placeholder="Title" required />
        <br />

        <textarea name="description" placeholder="Description" required />
        <br />

        <input type="date" name="date" required />
        <br />

        <input name="location" placeholder="Location" />
        <br />

        <input name="note" placeholder="Internal note" />
        <br />

        <input
          name="donation_url"
          placeholder="Donation URL (optional)"
          type="url"
        />
        <br />

        <select name="status">
          <option value="1">Pending</option>
          <option value="2">Published</option>
          <option value="3">Archived</option>
        </select>
        <br />

        {/* MAIN IMAGE */}
        <label>Main image</label>
        <input
          type="file"
          accept="image/*"
          required
          onChange={(e) => e.target.files && handleMainImage(e.target.files[0])}
        />
        <br />

        {/* EXTRA IMAGES */}
        <label>Extra images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => e.target.files && handleExtraImages(e.target.files)}
        />
        <br />

        {/* HIDDEN FIELDS */}
        {mainImageUrl && (
          <input type="hidden" name="photo_url" value={mainImageUrl} />
        )}

        {extraImageUrls.map((url, i) => (
          <input
            key={i}
            type="hidden"
            name="extra_images"
            value={url}
          />
        ))}

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={!mainImageUrl}>
          Create Story
        </button>
      </form>
    </div>
  );
}
