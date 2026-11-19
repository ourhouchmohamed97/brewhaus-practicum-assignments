import Testimonials from '../components/Testimonials';
import Container from '../components/Container';

const stats = [
  { value: '4.9/5', label: 'Average rating' },
  { value: '12,000+', label: 'Travelers served' },
  { value: '150+', label: 'Expert guides' },
  { value: '500+', label: 'Destinations' },
];

// The full testimonials page. It reuses the existing Testimonials component
// (which renders every review from the data file) so the page and the
// homepage preview share the same markup and styling.
function TestimonialsPage() {
  return (
    <>
      <section className="bg-surface py-16 sm:py-24">
        <Container>
          <div className="mb-10 text-center">
            <p className="mb-2 text-[0.72rem] font-semibold uppercase tracking-wide text-accent">Guest Stories</p>
            <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              What Our Travelers Say
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-ink-soft">
              Real stories from real travelers who trusted us with their journeys. Read about the moments that made their trips unforgettable.
            </p>
          </div>

          <Testimonials />

          <div className="mt-16 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-line bg-surface p-6 text-center shadow-card">
                <div className="font-display text-3xl font-bold text-navy sm:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm text-ink-soft">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

export default TestimonialsPage;