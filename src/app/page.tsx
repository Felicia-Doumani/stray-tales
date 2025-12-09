export default function Home() {
  return (
    <main className="p-10 max-w-2xl mx-auto text-center">
      <h1 className="text-3xl font-bold">Stray Tales</h1>

      <p className="mt-4 text-lg">
        A place to share the stories of stray animals in Samos. Simple, warm, and focused on giving every animal a voice.
      </p>

      <a
        href="/stories"
        className="inline-block mt-8 px-6 py-3 bg-black text-white rounded-lg text-lg"
      >
        Stories
      </a>
    </main>
  );
}
