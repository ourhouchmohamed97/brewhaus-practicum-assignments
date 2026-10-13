import { reviews } from '../data/reviews';
import Container from './Container';
import { StarIcon, PinIcon, GlobeIcon, StarOutlineIcon, ShieldIcon } from './Icons';

const pressLogos = [
  { name: 'Travel+Leisure', Icon: GlobeIcon },
  { name: 'Conde Nast', Icon: StarOutlineIcon },
  { name: 'TripAdvisor', Icon: ShieldIcon },
];

function Testimonials() {
  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="bg-surface-alt py-14 sm:py-20">
      <Container>
        <div className="mb-14 text-center">
          <p className="mb-2 text-[0.72rem] font-semibold uppercase tracking-wide text-accent">Guest Reviews</p>
          <h2 id="testimonials-title" className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            What Our Travelers Say
          </h2>
          <div className="mx-auto mt-5 h-[3px] w-16 rounded bg-accent" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <figure
              key={review.id}
              className="flex min-w-0 flex-col gap-4 rounded-xl border border-line bg-surface p-6 shadow-card md:last:col-span-2 lg:last:col-span-1"
            >
              {/* 5 stars: filled if the index is below the rating */}
              <p className="flex gap-0.5" role="img" aria-label={`${review.rating} out of 5 stars`}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <StarIcon key={i} filled={i < review.rating} />
                ))}
              </p>

              <blockquote className="relative flex-1 text-[0.94rem] italic leading-relaxed text-ink-soft before:absolute before:-left-1 before:-top-2 before:font-display before:text-5xl before:leading-none before:text-ink-muted/25 before:content-['\201C']">
                <p>{review.quote}</p>
              </blockquote>

              <figcaption className="mt-4 flex items-center gap-3">
                <img src={review.avatar} alt="" width="40" height="40" loading="lazy" className="h-10 w-10 rounded-full object-cover" />
                <span>
                  <strong className="block text-[0.78rem] uppercase tracking-wide">{review.name}</strong>
                  <small className="flex items-center gap-1 text-[0.68rem] text-ink-muted">
                    <PinIcon size={11} />
                    {review.location}
                  </small>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <ul className="mt-14 flex flex-wrap items-center justify-center gap-x-11 gap-y-4 text-lg font-semibold text-ink-muted" aria-label="As featured in">
          {pressLogos.map(({ name, Icon }) => (
            <li key={name} className="flex items-center gap-2.5">
              <Icon size={20} />
              {name}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export default Testimonials;
