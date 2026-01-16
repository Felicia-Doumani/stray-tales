// src/app/admin/stories/edit/[id]/ExistingImagesClient.tsx
"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type ImageRow = { id: string; image_url: string };

function parseBucketAndPath(value: string): { bucket: string; path: string } | null {
  // If it's already like "bucket/path/to/file.jpg"
  if (!value.includes("/storage/v1/")) {
    const parts = value.split("/").filter(Boolean);
    if (parts.length >= 2) {
      return { bucket: parts[0], path: parts.slice(1).join("/") };
    }
    return null;
  }

  // Full URL (public, signed, authenticated)
  try {
    const u = new URL(value);
    const parts = u.pathname.split("/").filter(Boolean);

    // Find ".../storage/v1/object/<mode>/<bucket>/<path...>"
    // mode can be: public | sign | authenticated
    const storageIdx = parts.indexOf("storage");
    const v1Idx = parts.indexOf("v1");
    const objectIdx = parts.indexOf("object");

    if (storageIdx === -1 || v1Idx === -1 || objectIdx === -1) return null;

    const mode = parts[objectIdx + 1]; // public | sign | authenticated
    const bucket = parts[objectIdx + 2];
    const pathParts = parts.slice(objectIdx + 3);

    if (!mode || !bucket || pathParts.length === 0) return null;

    return { bucket, path: decodeURIComponent(pathParts.join("/")) };
  } catch {
    return null;
  }
}

export default function ExistingImagesClient({ images }: { images: ImageRow[] }) {
  const supabase = createClient();
  const router = useRouter();

  async function deleteImage(img: ImageRow) {
    // DEBUG: show the exact stored value
    alert("image_url value:\n" + img.image_url);

    const parsed = parseBucketAndPath(img.image_url);

    if (!parsed) {
      alert("Could not parse bucket/path from image_url.");
      return;
    }

    alert("Parsed:\nBucket: " + parsed.bucket + "\nPath: " + parsed.path);

    const { error: storageErr } = await supabase.storage
      .from(parsed.bucket)
      .remove([parsed.path]);

    if (storageErr) {
      alert("Storage delete error:\n" + storageErr.message);
      return;
    }

    const { error: dbErr } = await supabase
      .from("story_images")
      .delete()
      .eq("id", img.id);

    if (dbErr) {
      alert("DB delete error:\n" + dbErr.message);
      return;
    }

    router.refresh();
  }

  return (
    <div>
      <label>Existing images</label>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
        {(images ?? []).map((img) => (
          <div key={img.id} style={{ position: "relative", width: "80px", height: "80px" }}>
            <img
              src={img.image_url}
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "8px",
                pointerEvents: "none",
              }}
            />

            <button
              type="button"
              onClick={() => deleteImage(img)}
              style={{
                position: "absolute",
                top: "-6px",
                right: "-6px",
                zIndex: 9999,
                background: "#111",
                color: "#fff",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                border: "none",
                cursor: "pointer",
                fontSize: "12px",
                lineHeight: "20px",
              }}
              title="Delete image"
            >
              x
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
