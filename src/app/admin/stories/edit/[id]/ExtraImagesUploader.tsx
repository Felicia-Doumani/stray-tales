// src/app/admin/stories/edit/[id]/ExtraImagesUploader.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ExtraImagesUploader() {
  const supabase = createClient();
  const [previews, setPreviews] = useState<string[]>([]);

  async function handleUpload(files: FileList | null) {
    if (!files) return;

    const container = document.getElementById("extra-images-hidden");
    if (!container) return;

    for (const file of Array.from(files)) {
      const path = `${crypto.randomUUID()}-${file.name}`;

      const { error } = await supabase.storage
        .from("stories-photos")
        .upload(path, file);

      if (error) continue;

      const { data } = supabase.storage
        .from("stories-photos")
        .getPublicUrl(path);

      setPreviews((prev) => [...prev, data.publicUrl]);

      const input = document.createElement("input");
      input.type = "hidden";
      input.name = "extra_images";
      input.value = data.publicUrl;
      container.appendChild(input);
    }
  }

  return (
    <div style={{ marginTop: "1.5rem" }}>
      <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 500 }}>
        Add more images
      </label>

      <label
        style={{
          display: "block",
          border: "2px dashed #d1d5db",
          borderRadius: "12px",
          padding: "1.2rem",
          textAlign: "center",
          cursor: "pointer",
          background: "#fafafa",
        }}
      >
        <strong>Select images</strong>
        <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.25rem" }}>
          Previews will appear below before saving
        </p>

        <input
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={(e) => handleUpload(e.target.files)}
        />
      </label>

      {/* PREVIEWS */}
      {previews.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginTop: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          {previews.map((url, i) => (
            <img
              key={i}
              src={url}
              alt="Selected preview"
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

      <div id="extra-images-hidden" />
    </div>
  );
}
