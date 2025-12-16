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

      <section className="w-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Stray Tales
          </h1>
          <p className="text-base md:text-lg text-gray-300 leading-relaxed">
            Sharing stories of stray animals in Samos. A simple place focused on giving every animal a voice.
          </p>
        </div>
      </section>

      <section className="w-full bg-white">
        <div className="max-w-6xl mx-auto px-6 py-14 text-center text-gray-600 text-sm leading-7">
          <p className="mb-6">
            For many years in Samos, the care of stray animals has depended almost entirely on volunteers.
            Official support is minimal, and the responsibility falls on a very small number of people
            who continue to help despite limited resources and constant pressure.
          </p>

          <p className="mb-6">
            The number of animals in need is overwhelming, while those who can help are few.
            Many stray animals have received medical treatment, found adopters, or were simply given safety and care.
            Sadly, others did not make it.
          </p>

          <p>
            Their stories matter. This platform focuses specifically on Samos Island,
            giving visibility to lives that would otherwise remain unseen.
          </p>
        </div>
      </section>

      <section className="w-full bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-14 text-center">
          <h2 className="text-2xl font-semibold mb-8">
            Explore their stories
          </h2>

          <div className="flex flex-nowrap justify-center items-center gap-6">
            {stories?.map((story) => (
              <Link key={story.id} href={`/stories/${story.id}`}>
                <div className="w-40 h-28 overflow-hidden rounded-lg flex-shrink-0">
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
              className="group flex items-center gap-3 text-gray-700 font-semibold hover:text-gray-900 transition flex-shrink-0"
            >
              <span>Read more</span>

              <span className="relative block w-6 h-px bg-gray-700 group-hover:bg-gray-900 transition">
                <span className="absolute right-0 top-[-4px] w-2 h-2 border-t-2 border-r-2 border-gray-700 rotate-45 group-hover:border-gray-900 transition"></span>
              </span>
            </Link>

          </div>
        </div>

      </section>

    </div>
  );
}
