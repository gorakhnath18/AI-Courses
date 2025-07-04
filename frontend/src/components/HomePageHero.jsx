function HomePageHero() {
  return (
    <div className="text-center py-12 sm:py-20">
      <h1 className="text-4xl font-display font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
        Adaptive Learning <span className="text-blue-500">Explorer</span>
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400 sm:text-xl">
        Enter any topic to generate a dynamic learning roadmap and dive deep into each concept on-demand.
      </p>
      <form className="mt-10 max-w-xl mx-auto">
        <div className="relative">
          <input type="text" name="prompt" className="w-full bg-gray-900 border border-gray-700 rounded-md shadow-lg px-5 py-4 text-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder='e.g., "Quantum Computing"' required />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white font-bold px-6 py-2 rounded-md shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105">
            Explore
          </button>
        </div>
      </form>
    </div>
  );
}
export default HomePageHero;
