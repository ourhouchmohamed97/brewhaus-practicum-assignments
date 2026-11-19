import Container from './Container';

function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="grid min-h-[520px] place-items-center bg-navy bg-cover bg-center py-16 text-center text-white sm:min-h-[565px]"
      // Dark gradient on top of the photo keeps the white text readable.
      style={{
        backgroundImage:
          "linear-gradient(rgba(10,16,40,.35), rgba(10,16,40,.55)), url('/images/hero.png')",
      }}
    >
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="mb-5 inline-block rounded-full border border-white/30 bg-white/10 px-3.5 py-2 text-[0.62rem] font-semibold uppercase tracking-wide">
            Experience the Extraordinary
          </p>

          {/* The ONE h1 of the page */}
          <h1 id="hero-title" className="font-display text-4xl font-bold leading-[1.08] tracking-tight [text-wrap:balance] sm:text-5xl lg:text-[3.6rem]">
            Explore the World&apos;s Best Destinations
          </h1>

          <p className="mx-auto mb-8 mt-6 max-w-[34em] font-display text-lg font-medium leading-snug text-white/90 sm:text-xl lg:text-[1.35rem]">
            Curated luxury travel experiences designed to inspire your spirit and create memories that last a lifetime.
          </p>

          <div className="flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
            <a href="#quote" className="rounded-full bg-accent px-8 py-4 font-semibold text-white transition hover:-translate-y-px hover:bg-accent-dark">
              Plan Your Trip
            </a>
            <a href="#packages" className="rounded-full border-[1.5px] border-white/55 px-8 py-4 font-semibold text-white transition hover:-translate-y-px hover:bg-white/10">
              Explore Gallery
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Hero;
