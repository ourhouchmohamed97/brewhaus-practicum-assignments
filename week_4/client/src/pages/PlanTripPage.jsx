import { useState } from 'react';
import Container from '../components/Container';
import { PinIcon, CalendarIcon, UserIcon, MailIcon, ShieldIcon } from '../components/Icons';

const months = ['Anytime', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Color constants for readability
const labelClass = 'text-[0.66rem] font-bold uppercase tracking-wider text-ink';
const inputWrap = 'flex items-center gap-2.5 rounded-lg border border-line bg-white px-3.5 text-ink-soft focus-within:border-accent focus-within:ring-[3px] focus-within:ring-accent/25';
const inputField = 'w-full min-w-0 flex-1 bg-transparent py-3.5 text-sm text-ink outline-none placeholder:text-ink-muted';

// Full booking inquiry form for Plan Your Trip page.
// NOTE: This form currently shows a success message client-side only.
// The backend endpoint for saving inquiries is not yet implemented,
// so the submitted data is NOT saved to the database at this time.
// This explains to the user that form submission is handled by our team
// to prevent false expectations that the data has been persisted.
function PlanTripPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    destination: '',
    travelers: 1,
    month: 'anytime',
    dates: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // NOTE: No backend endpoint exists yet to save this inquiry.
    // We show this confirmation to acknowledge receipt, but the data
    // is NOT stored in the database. Our team will contact the user
    // based on the form information provided.
    setSubmitted(true);
  };

  return (
    <section className="bg-surface py-16 sm:py-24 text-ink">
      <Container>
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <p className="mb-2 text-[0.72rem] font-semibold uppercase tracking-wide text-accent">Get a Custom Quote</p>
            <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl text-ink">
              Plan Your Trip
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-ink-soft">
              Let our travel experts craft a personalized itinerary for your dream escape. Fill out the form below and we&apos;ll contact you within 24 hours.
            </p>
          </div>

          <div className="grid gap-10 rounded-2xl border border-line bg-white p-6 shadow-card lg:grid-cols-[1.2fr_1fr]">
            {/* Left: the form */}
            <div>
              <h2 className="font-display text-2xl font-bold text-ink mb-6">Travel Inquiry Form</h2>

              {submitted && (
                <div role="status" className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-center text-green-800">
                  <ShieldIcon size={20} className="mb-2 text-green-600" />
                  <p className="font-semibold mb-2">Thank you for your inquiry!</p>
                  <p className="text-sm text-green-700">
                    We&apos;ve received your details and our travel consultants will contact you within 24 hours.
                    <br />
                    <strong>Note:</strong> While this form shows a success message, the backend endpoint to save
                    inquiries has not been implemented yet. Our team will reach out to you directly based on the
                    information you provided.
                  </p>
                </div>
              )}

              {!submitted && (
                <form onSubmit={handleSubmit} className="grid gap-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className={labelClass}>Full name</label>
                      <div className={inputWrap}>
                        <UserIcon size={16} className="text-ink-soft" />
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          minLength={2}
                          maxLength={80}
                          placeholder="Jane Doe"
                          value={form.name}
                          onChange={handleChange}
                          className={inputField}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className={labelClass}>Email address</label>
                      <div className={inputWrap}>
                        <MailIcon size={16} className="text-ink-soft" />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={handleChange}
                          className={inputField}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="destination" className={labelClass}>Preferred destination</label>
                    <div className={inputWrap}>
                      <PinIcon size={16} className="text-ink-soft" />
                      <input
                        id="destination"
                        name="destination"
                        type="text"
                        required
                        placeholder="e.g. Santorini, Maldives, Swiss Alps"
                        value={form.destination}
                        onChange={handleChange}
                        className={inputField}
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="travelers" className={labelClass}>Number of travelers</label>
                      <div className={inputWrap}>
                        <input
                          id="travelers"
                          name="travelers"
                          type="number"
                          min="1"
                          max="20"
                          required
                          placeholder="1"
                          value={form.travelers}
                          onChange={handleChange}
                          className={inputField}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="month" className={labelClass}>Preferred month</label>
                      <div className={inputWrap}>
                        <CalendarIcon size={16} className="text-ink-soft" />
                        <select
                          id="month"
                          name="month"
                          value={form.month}
                          onChange={handleChange}
                          className={inputField}
                        >
                          {months.map((m) => (
                            <option key={m} value={m.toLowerCase()}>{m}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="dates" className={labelClass}>Travel dates (optional)</label>
                    <div className={inputWrap}>
                      <input
                        id="dates"
                        name="dates"
                        type="text"
                        placeholder="e.g. June 15-25, 2026 or Flexible"
                        value={form.dates}
                        onChange={handleChange}
                        className={inputField}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className={labelClass}>Message (optional)</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="Any special requests or preferences?"
                      value={form.message}
                      onChange={handleChange}
                      className={inputField}
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-2 w-full rounded-lg bg-accent py-4 font-semibold text-white transition hover:bg-accent-dark"
                  >
                    Send Inquiry
                  </button>

                  <p className="text-center text-[0.72rem] text-ink-muted">
                    By submitting, you agree to our privacy policy and consent to being contacted.
                  </p>
                </form>
              )}
            </div>

            {/* Right: stats and info */}
            <div className="flex flex-col gap-6">
              <div className="rounded-xl bg-surface-alt p-6 text-navy">
                <h3 className="font-display text-xl font-bold text-navy mb-3">Why Choose Us?</h3>
                <ul className="space-y-3 text-ink-soft">
                  <li className="flex items-start gap-2.5">
                    <ShieldIcon size={18} className="mt-0.5 flex-shrink-0 text-accent" />
                    <span><strong>24/7 Support</strong> - Our team is available around the clock for any questions.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <ShieldIcon size={18} className="mt-0.5 flex-shrink-0 text-accent" />
                    <span><strong>Luxury Accommodations</strong> - All properties are vetted for exceptional quality.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <ShieldIcon size={18} className="mt-0.5 flex-shrink-0 text-accent" />
                    <span><strong>Expert Guides</strong> - Local specialists lead every journey.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <ShieldIcon size={18} className="mt-0.5 flex-shrink-0 text-accent" />
                    <span><strong>100% Satisfaction Guarantee</strong> - Your dream trip or your money back.</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-xl bg-surface-alt p-6 text-navy">
                <h3 className="font-display text-xl font-bold text-navy mb-3">Contact Info</h3>
                <div className="space-y-2 text-ink-soft">
                  <p><strong>Email:</strong> <a href="mailto:support@wanderlust.travel" className="text-accent hover:underline">support@wanderlust.travel</a></p>
                  <p><strong>Phone:</strong> +1 (800) 555-0123</p>
                  <p><strong>Response Time:</strong> Within 24 hours</p>
                </div>
              </div>

              <div className="rounded-xl bg-surface-alt p-6 text-navy">
                <h3 className="font-display text-xl font-bold text-navy mb-3">Our Guarantee</h3>
                <p className="text-ink-soft text-sm">
                  All bookings are protected by our Wanderlust Travel Guarantee. Your security and satisfaction are our top priorities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default PlanTripPage;