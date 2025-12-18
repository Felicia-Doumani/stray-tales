// src/app/stories/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type Story = {
  id: string;
  title: string;
  description: string;
  photo_url: string;
  story_date: string;
  location: string | null;
  status_id: number | null;
  donation_url: string | null;
  note: string | null;
  user_id: string;
};

const STATUS_LABELS: Record<number, string> = {
  1: "Looking for a home",
  2: "In foster care",
  3: "Adopted",
  4: "Back on the streets",
  5: "Missing",
  6: "In treatment / recovering",
  7: "Gone (deceased)",
};

export default function StoryPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const supabase = createClient();

  const [story, setStory] = useState<Story | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isOwner, setIsOwner] = useState(false);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();

      const { data: storyData } = await supabase
        .from("stories")
        .select("*")
        .eq("id", id)
        .single<Story>();

      if (!storyData) {
        router.push("/stories");
        return;
      }

      const { data: extraImages } = await supabase
        .from("story_images")
        .select("image_url")
        .eq("story_id", id)
        .order("created_at", { ascending: true });

      setStory(storyData);
      setImages([
        storyData.photo_url,
        ...(extraImages?.map((i) => i.image_url) ?? []),
      ]);
      setIsOwner(user?.id === storyData.user_id);
    }

    load();
  }, [id, router, supabase]);

  function openLightbox(index: number) {
    setCurrentIndex(index);
    setLightboxOpen(true);
  }

  function closeLightbox() {
    setLightboxOpen(false);
  }

  function next() {
    setCurrentIndex((i) => (i + 1) % images.length);
  }

  function prev() {
    setCurrentIndex((i) => (i - 1 + images.length) % images.length);
  }

  async function deleteStory() {
    if (!story) return;
    await supabase.from("stories").delete().eq("id", story.id);
    router.push("/stories");
  }

  if (!story) return null;

  return (
    <div style={{ padding: "2rem", maxWidth: "1100px", margin: "0 auto" }}>
      <Link
        href="/stories"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          marginBottom: "1.2rem",
          padding: "0.35rem 0.9rem",
          borderRadius: "999px",
          background: "#e5f6f3",
          color: "#0f766e",
          fontSize: "0.8rem",
          fontWeight: 500,
          textDecoration: "none",
        }}
      >
        ← Back to stories
      </Link>

      <h1>{story.title}</h1>

      <p style={{ color: "#666", fontSize: "0.85rem" }}>
        {new Date(story.story_date).toLocaleDateString()}
        {story.location && ` • ${story.location}`}
      </p>

      {story.status_id && (
        <span
          style={{
            display: "inline-block",
            padding: "0.25rem 0.6rem",
            borderRadius: "999px",
            background: "#eef2ff",
            color: "#3730a3",
            fontSize: "0.75rem",
            fontWeight: 600,
          }}
        >
          {STATUS_LABELS[story.status_id]}
        </span>
      )}

      {/* MAIN IMAGE + ACTIONS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "480px auto",
          gap: "1.5rem",
          marginTop: "1rem",
        }}
      >
        <button
          onClick={() => openLightbox(0)}
          style={{ border: "none", background: "none", padding: 0, cursor: "pointer" }}
        >
          <Image
            src={images[0]}
            alt={story.title}
            width={480}
            height={480}
            style={{ width: "100%", borderRadius: "12px" }}
          />
        </button>

        {isOwner && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", alignItems: "flex-start" }}>
            <Link
              href={`/admin/stories/edit/${id}`}
              style={{
                display: "inline-flex",
                width: "fit-content",
                padding: "0.25rem 0.6rem",
                background: "#2563eb",
                color: "white",
                borderRadius: "999px",
                fontSize: "0.7rem",
                textDecoration: "none",
              }}
            >
              Edit
            </Link>

            <button
              onClick={deleteStory}
              style={{
                display: "inline-flex",
                width: "fit-content",
                padding: "0.25rem 0.6rem",
                background: "#ef4444",
                color: "white",
                borderRadius: "999px",
                fontSize: "0.7rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* EXTRA IMAGES (CLICKABLE) */}
      {images.length > 1 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1rem",
            marginTop: "2rem",
          }}
        >
          {images.slice(1).map((url, i) => (
            <button
              key={url}
              onClick={() => openLightbox(i + 1)}
              style={{ border: "none", background: "none", padding: 0, cursor: "pointer" }}
            >
              <Image
                src={url}
                alt="Extra image"
                width={300}
                height={300}
                style={{ width: "100%", borderRadius: "8px" }}
              />
            </button>
          ))}
        </div>
      )}

      <p style={{ marginTop: "2rem", whiteSpace: "pre-line", lineHeight: 1.6 }}>
        {story.description}
      </p>

      {/* LIGHTBOX */}
      {lightboxOpen && (
        <div
          onClick={closeLightbox}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            style={{ position: "absolute", left: 20, color: "white", fontSize: 32 }}
          >
            ‹
          </button>

          <Image
            src={images[currentIndex]}
            alt="Full view"
            width={1200}
            height={1200}
            style={{ maxHeight: "90vh", width: "auto" }}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            style={{ position: "absolute", right: 20, color: "white", fontSize: 32 }}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
