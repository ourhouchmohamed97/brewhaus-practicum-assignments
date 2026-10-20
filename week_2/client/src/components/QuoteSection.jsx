import { useState } from 'react';
import Container from './Container';
import { PinIcon, CalendarIcon } from './Icons';

const months = [
  'Anytime', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const stats = [
  { value: '500+', label: 'Destinations' },
  { value: '12k', label: 'Happy Travelers' },
  { value: '150+', label: 'Expert Guides' },
];

const inputWrap =
  'flex items-center gap-2.5 rounded-lg border border-line bg-surface px-3.5 text-ink-soft focus-within:border-accent focus-within:ring-[3px] focus-within:ring-accent/25';
const inputField =
  'w-full min-w-0 flex-1 bg-transparent py-3.5 text-sm text-ink outline-none placeholder:text-ink-muted';
const labelClass = 'text-[0.66rem] font-bold uppercase tracking-wider text-ink';

function QuoteSection() {
  // CONTROLLED FORM
  // One state object holds ALL the form values. Each input shows `form.something`
  // and updates it on every keystroke, so React always knows what's typed.
  const [form, setForm] = useState({ destination: '', month: 'anytime', travelers: 2 });
  const [submitted, setSubmitted] = useState(false);

  // One handler for every input. `name` tells us which field changed.
  // `{ ...form, [name]: value }` copies the old object and replaces only that field.
  // (We never modify state directly: we always give React a NEW object.)
  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // stop the browser from reloading the page
    setSubmitted(true);     // there is no backend: we just show a confirmation message
  };

  return (
    <section
      id="quote"
      aria-labelledby="quote-title"
      // Mobile: plain navy. lg: navy with a charcoal strip on the right (hard color stop at 79%).
      className="bg-navy py-14 text-white sm:py-20 lg:bg-[linear-gradient(90deg,#0f1a3a_79%,#26262b_79%)]"
    >
      <Container className="grid items-center gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
        {/* Left: copy + stats */}
        <div className="min-w-0">
          <h2 id="quote-title" className="max-w-[9em] font-display text-4xl font-bold leading-[1.12] sm:text-5xl">
            Ready for your next big adventure?
          </h2>
          <p className="mt-7 max-w-[29em] text-[1.05rem] leading-relaxed text-white/80">
            Tell us where you want to go and our travel consultants will craft a personalized itinerary just for you. No commitment, just inspiration.
          </p>

          <dl className="mt-9 flex flex-wrap gap-y-5">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse border-l border-white/20 px-4 first:border-l-0 first:pl-0 sm:px-8">
                <dt className="text-[0.7rem] text-white/60">{stat.label}</dt>
                <dd className="text-2xl font-bold leading-tight sm:text-3xl">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Right: the form card */}
        <form onSubmit={handleSubmit} className="min-w-0 rounded-xl bg-white p-6 text-ink shadow-2xl sm:p-8 lg:max-w-none">
          <h3 className="text-[1.4rem] font-bold tracking-tight">Get a Custom Quote</h3>
          <p className="mb-6 mt-1.5 text-[0.82rem] text-ink-soft">Response within 24 hours.</p>

          <div className="mb-5 flex flex-col gap-2">
            <label htmlFor="destination" className={labelClass}>Where do you want to go?</label>
            <div className={inputWrap}>
              <PinIcon size={16} />
              <input
                id="destination"
                name="destination"
                type="text"
                required
                placeholder="e.g. Patagonia, Japan, Iceland"
                value={form.destination} // the input SHOWS the state...
                onChange={handleChange}  // ...and every keystroke UPDATES the state
                className={inputField}
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 sm:gap-4">
            <div className="flex min-w-0 flex-col gap-2">
              <label htmlFor="month" className={labelClass}>Preferred month</label>
              <div className={inputWrap}>
                <CalendarIcon size={16} />
                <select id="month" name="month" value={form.month} onChange={handleChange} className={inputField}>
                  {months.map((m) => (
                    <option key={m} value={m.toLowerCase()}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-2">
              <label htmlFor="travelers" className={labelClass}>Travelers</label>
              <div className={inputWrap}>
                <input
                  id="travelers"
                  name="travelers"
                  type="number"
                  min="1"
                  max="20"
                  value={form.travelers}
                  onChange={handleChange}
                  className={inputField}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-accent py-4 font-semibold text-white transition hover:bg-accent-dark"
          >
            Plan Your Trip
          </button>

          {/* Conditional rendering: this message only exists after `submitted` is true */}
          {submitted && (
            <p role="status" className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-800">
              Thanks! We&apos;ll contact you within 24 hours about {form.destination || 'your trip'}.
            </p>
          )}

          <p className="mt-4 text-center text-[0.62rem] leading-normal text-ink-muted">
            By submitting this form, you agree to our privacy policy and consent to being contacted regarding your travel inquiry.
          </p>
        </form>
      </Container>
    </section>
  );
}

export default QuoteSection;
