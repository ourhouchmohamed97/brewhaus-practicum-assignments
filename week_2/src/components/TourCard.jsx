import { useState } from 'react';
import QuantityStepper from './QuantityStepper';
import { ClockIcon, StarIcon } from './Icons';

// One reusable card. It receives ONE tour object as a prop and displays it.
function TourCard({ tour }) {
  const [seats, setSeats] = useState(1);
  const total = tour.price * seats;
  const money = (n) => `$${n.toLocaleString('en-US')}`;

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-line bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image + badge */}
      <div className="relative aspect-[16/9.5] overflow-hidden">
        <img src={tour.image} alt={tour.imageAlt} width="600" height="400" loading="lazy" className="h-full w-full object-cover" />
        <span className="absolute left-3 top-3 rounded bg-accent px-2 py-0.5 text-[0.66rem] font-semibold text-white">
          {tour.badge}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
        {/* Duration + rating */}
        <div className="flex items-center justify-between gap-2 text-[0.68rem] font-medium uppercase tracking-wide text-ink-soft">
          <p className="flex items-center gap-1.5">
            <ClockIcon size={14} />
            <span>{tour.days} Days / {tour.nights} Nights</span>
          </p>
          <p className="flex items-center gap-1" aria-label={`Rated ${tour.rating} out of 5`}>
            <StarIcon size={13} />
            <span>{tour.rating.toFixed(1)}</span>
          </p>
        </div>

        <h3 className="mb-1 mt-2 text-lg font-bold tracking-tight">{tour.title}</h3>
        <p className="mb-3 text-xs font-medium text-accent-dark">{tour.destination}</p>
        <p className="mb-3 text-sm leading-relaxed text-ink-soft">{tour.description}</p>

        {/* Features list, generated with .map() */}
        <ul className="mb-5 grid gap-2 text-[0.8rem] text-ink-soft">
          {tour.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-accent" />
              {feature}
            </li>
          ))}
        </ul>

        {/* Controlled component: we give it the state (value) and the setter (onChange) */}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4">
          <QuantityStepper value={seats} onChange={setSeats} min={1} max={10} label="Seats" />
          <p className="text-right text-xs text-ink-muted">
            Total <strong className="block text-base text-ink">{money(total)}</strong>
          </p>
        </div>

        {/* Price + button */}
        <div className="mt-4 flex items-center justify-between gap-4 border-t border-line pt-4">
          <p>
            <span className="block text-[0.6rem] font-semibold uppercase tracking-widest text-ink-muted">Starting from</span>
            <strong className="text-2xl font-bold tracking-tight">{money(tour.price)}</strong>
          </p>
          <a
            href="#quote"
            aria-label={`View details for ${tour.title}`}
            className="rounded-full border border-line bg-surface px-4 py-2.5 text-xs font-semibold transition hover:border-ink-soft"
          >
            View Details
          </a>
        </div>
      </div>
    </article>
  );
}

export default TourCard;
