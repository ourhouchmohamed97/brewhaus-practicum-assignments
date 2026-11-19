import TourGrid from '../components/TourGrid';
import Container from '../components/Container';

// The full tour listing page. It reuses the existing TourGrid component
// (which loads from the API and renders TourCard) so the /packages route
// looks and behaves exactly like the homepage gallery — no duplicate code.
function PackagesPage() {
  return (
    <section className="py-14 sm:py-20">
      <Container>
        <div className="mb-10 text-center">
          <p className="mb-2 text-[0.72rem] font-semibold uppercase tracking-wide text-accent">All Journeys</p>
          <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            Tour Packages
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-ink-soft">
            Browse every curated journey we offer. Filter by experience type, then click any card to see the full itinerary, pricing, and what&apos;s included.
          </p>
        </div>

        <TourGrid />
      </Container>
    </section>
  );
}

export default PackagesPage;