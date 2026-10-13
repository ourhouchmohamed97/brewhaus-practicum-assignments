import { useState } from 'react';
import { tours } from '../data/tours';
import TourCard from './TourCard';
import Container from './Container';
import { ChevronRightIcon } from './Icons';

// Build the filter buttons from the data itself: ['All', 'Adventure', 'Cultural', ...]
// `new Set` removes duplicates, so each category appears once.
const categories = ['All', ...new Set(tours.map((tour) => tour.category))];

function TourGrid() {
  // useState #2: which filter is selected right now?
  // - activeCategory = current value ('All' at first)
  // - setActiveCategory = the function that changes it and re-renders the grid
  const [activeCategory, setActiveCategory] = useState('All');

  // Every render, we recompute the visible list from the full data.
  // We do NOT store the filtered list in state: it can always be derived
  // from `tours` + `activeCategory`. (State should be as small as possible.)
  const visibleTours =
    activeCategory === 'All'
      ? tours
      : tours.filter((tour) => tour.category === activeCategory);

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
        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter tours by category">
          {categories.map((category) => {
            const isActive = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveCategory(category)} // changing state = re-render with a new list
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

        {/* Cards: one <TourCard> per tour in the filtered list.
            `key` helps React track each card; we use the unique id. */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </Container>
    </section>
  );
}

export default TourGrid;
