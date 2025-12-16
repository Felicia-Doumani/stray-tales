// src/app/admin/stories/new/page.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { createStory } from "@/app/actions/createStory";

export default function NewStoryPage() {
  const supabase = createClient();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleImageUpload(file: File) {
    setError("");

    const filePath = `${crypto.randomUUID()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("stories-photos")
      .upload(filePath, file);

    if (uploadError) {
      setError(uploadError.message);
      return;
    }

    const { data } = supabase.storage
      .from("stories-photos")
      .getPublicUrl(filePath);

    setImageUrl(data.publicUrl);
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

        <input name="note" placeholder="Note" />
        <br />

        <select name="status">
          <option value="1">Pending</option>
          <option value="2">Published</option>
          <option value="3">Archived</option>
        </select>
        <br />

        <input
          type="file"
          accept="image/*"
          required
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleImageUpload(e.target.files[0]);
            }
          }}
        />
        <br />

        {imageUrl && (
          <input type="hidden" name="photo_url" value={imageUrl} />
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={!imageUrl}>
          Create Story
        </button>
      </form>
    </div>
  );
}
