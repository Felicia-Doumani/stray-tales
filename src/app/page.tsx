// src/app/page.tsx
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: stories } = await supabase
    .from("stories")
    .select("id, title, photo_url")
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <div className="w-full">
      {/* HERO (true center, full-width) */}
      <section className="w-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700">
        <div className="flex flex-col items-center text-center text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Animal Voices
          </h1>

          <p className="mt-4 text-base md:text-lg text-gray-300 leading-relaxed max-w-2xl">
            An independent space for sharing stories, urgent situations, and fundraising efforts for animals in need.
          </p>
        </div>

      </section>

      {/* ABOUT (left readable column + right full-bleed image) */}
      <section className="w-full bg-white">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2">
          {/* LEFT */}
        <div className="w-full max-w-2xl text-gray-800 text-base md:text-lg leading-8 space-y-10">
          <p>
            This is an <span className="font-medium text-teal-600">independent space</span> where
            <span className="font-medium text-teal-600"> urgent situations</span> and
            <span className="font-medium text-teal-600"> fundraising efforts</span> are shared, so people can support each other
            and help animals when it matters most. It is also a place for both painful and hopeful stories —
            stories that deserve to be <span className="text-purple-700">told, remembered, and not erased</span>.
          </p>

          <p>
            The stories shared here are about <span className="font-medium">all animals</span> — cats, dogs, sheep, horses, pigs,
            birds, and every other animal. Anyone who witnesses these lives up close can reach out and
            share their story, knowing it will be <span className="text-purple-700">heard with care and respect</span>.
          </p>

          <p className="italic text-gray-500 border-l-2 border-teal-200 pl-4">
            In reality, most of the responsibility falls on volunteers, while institutions are often absent, leaving people to
            rely on each other.
          </p>

          <p>
            This is a <span className="font-medium text-teal-600">safe and anonymous space</span>, free from official narratives.
            Every contribution matters, every effort counts, and the goal is simple:
            <span className="text-purple-700"> to speak up, not look away, and give animals the voice they do not have</span>.
          </p>
        </div>


          {/* RIGHT (fills the entire right half so there is no blank area) */}
        <div
          className="min-h-[420px] lg:min-h-full bg-center bg-no-repeat bg-contain bg-gray-100"
          style={{ backgroundImage: "url('/hero.png')" }}
        >
          <div className="w-full h-full bg-black/10" />
        </div>

        </div>
      </section>

      {/* STORIES PREVIEW */}
      <section className="w-full bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">


          <div className="mt-12 flex flex-wrap justify-center items-center gap-10">

            {stories?.map((story) => (
              <Link key={story.id} href={`/stories/${story.id}`}>
                <div className="w-48 h-32 overflow-hidden rounded-xl shadow-sm transition-transform duration-300 hover:scale-105">
                  <img
                    src={story.photo_url}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
            ))}

            <Link
              href="/stories"
              className="group flex items-center gap-3 text-gray-700 font-semibold hover:text-gray-900 transition"
            >
              <span>Read more</span>
              <span className="relative block w-8 h-px bg-gray-700 group-hover:bg-gray-900 transition">
                <span className="absolute right-0 -top-1 w-2.5 h-2.5 border-t-2 border-r-2 border-gray-700 rotate-45 group-hover:border-gray-900 transition" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
