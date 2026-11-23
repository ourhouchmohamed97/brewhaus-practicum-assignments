import { useEffect, useState } from 'react';
import TourCard from './TourCard';
import Container from './Container';
import { ChevronRightIcon } from './Icons';
import { api } from '../services/api';

// Categories are derived from the data that actually loads, so the filter
// bar always matches what the backend returned (no hard-coded list).
function buildCategories(tours) {
  return ['All', ...new Set(tours.map((tour) => tour.category))];
}

function TourGrid() {
  const [tours, setTours] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [status, setStatus] = useState('idle'); // idle | loading | ready | error
  const [errorMessage, setErrorMessage] = useState('');

  const categories = buildCategories(tours);
  const visibleTours =
    activeCategory === 'All'
      ? tours
      : tours.filter((tour) => tour.category === activeCategory);

  useEffect(() => {
    let cancelled = false;

    setStatus('loading');
    setErrorMessage('');

    api
      .getItems()
      .then((data) => {
        if (cancelled) return;
        setTours(data);
        setStatus('ready');
      })
      .catch((err) => {
        if (cancelled) return;
        setErrorMessage(err.message);
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="packages" aria-labelledby="packages-title" className="py-14 sm:py-20">
      <Container>
        {/* Section heading */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[0.72rem] font-semibold uppercase tracking-wide text-accent">Premium Experiences</p>
            <h2 id="packages-title" className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Featured Tour Packages
            </h2>
            <p className="mt-4 max-w-xl text-base text-ink-soft">
              Hand-picked journeys across seven continents, crafted with passion and local expertise for the modern explorer.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveCategory('All')}
            className="inline-flex items-center gap-2.5 self-start pb-1 text-[0.82rem] font-bold transition-colors hover:text-accent-dark sm:self-auto"
          >
            Browse All Packages <ChevronRightIcon size={16} />
          </button>
        </div>

        {/* Filter buttons: one per category, generated with .map() */}
        {categories.length > 1 && (
          <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter tours by category">
            {categories.map((category) => {
              const isActive = category === activeCategory;
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? 'border-navy bg-navy text-white'
                      : 'border-line bg-white text-ink-soft hover:border-ink-soft'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        )}

        {/* Loading / error states */}
        {status === 'loading' && (
          <div className="py-12 text-center text-ink-soft" role="status" aria-live="polite">
            Loading experiences from the database…
          </div>
        )}
        {status === 'error' && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center">
            <p className="font-semibold text-red-800">Could not load packages</p>
            <p className="mt-1 text-sm text-red-700">{errorMessage}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try again
            </button>
          </div>
        )}
        {status === 'ready' && visibleTours.length === 0 && (
          <div className="py-12 text-center text-ink-soft" role="status">
            No packages match this category yet.
          </div>
        )}

        {/* Item grid */}
        {status === 'ready' && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

export default TourGrid;