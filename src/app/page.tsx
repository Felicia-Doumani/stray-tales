export default function HomePage() {
  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="w-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 text-white py-20 px-6 text-center">
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight">
          Stray Tales
        </h1>

        <p className="text-lg max-w-2xl mx-auto text-gray-300">
          Sharing stories of stray animals in Samos. A simple place focused on giving every animal a voice.
        </p>
      </section>

      {/* MAIN CONTENT */}
      <section className="flex justify-center mt-10 px-6">
        <div className="max-w-3xl w-full bg-white shadow-md rounded-xl p-8">
          <p className="text-gray-700 text-lg">
            Welcome to Stray Tales. Explore rescue stories, learn about the challenges stray animals face, and follow the lives of the animals who found safety, hope, and sometimes a new home.
          </p>
        </div>
      </section>
    </div>
  );
}
