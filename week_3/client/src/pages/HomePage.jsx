import Hero from '../components/Hero';
import TourGrid from '../components/TourGrid';
import Testimonials from '../components/Testimonials';
import QuoteSection from '../components/QuoteSection';
import Container from '../components/Container';
import { ShieldIcon, StarIcon } from '../components/Icons';

const features = [
  { title: 'Expert Local Guides', description: 'Our certified experts know every destination intimately.' },
  { title: 'Luxury Accommodations', description: 'We curate only the finest properties worldwide.' },
  { title: '24/7 Support', description: 'Your travel peace of mind is our priority, anytime.' },
  { title: 'Satisfaction Guarantee', description: 'Love your journey or we make it right.' },
];

function WhyChooseUs() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <Container>
        <div className="mb-10 text-center">
          <h2 id="why-us-title" className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl text-navy">
            Why Choose Us?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-ink-soft">
            We’ve crafted every detail of our service to make your journey effortless and extraordinary.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-xl border border-line bg-surface p-6 shadow-card">
              <div className="mb-4 flex items-center gap-2.5">
                <div className="rounded-full bg-navy p-2.5">
                  <ShieldIcon size={20} className="text-white" />
                </div>
                <h3 className="font-display text-lg font-bold text-navy">{feature.title}</h3>
              </div>
              <p className="text-sm text-ink-soft leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function HomePage() {
  return (
    <>
      <Hero />
      <TourGrid />
      <WhyChooseUs />
      <Testimonials />
      <QuoteSection />
    </>
  );
}

export default HomePage;