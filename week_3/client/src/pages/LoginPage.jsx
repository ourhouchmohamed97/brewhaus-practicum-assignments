import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthCard from '../components/AuthCard';

// Shared input styling, lifted from QuoteSection so the forms feel like part
// of the same website.
const labelClass = 'text-[0.66rem] font-bold uppercase tracking-wider text-ink';
const inputWrap =
  'flex items-center gap-2.5 rounded-lg border border-line bg-surface px-3.5 text-ink-soft focus-within:border-accent focus-within:ring-[3px] focus-within:ring-accent/25';
const inputField =
  'w-full min-w-0 flex-1 bg-transparent py-3.5 text-sm text-ink outline-none placeholder:text-ink-muted';

function LoginPage() {
  const { login, isAuthenticated, loading, error } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/" />;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await login(form.email, form.password);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // Full-height flex column: centers the card both horizontally and
    // vertically in the space below the navbar, on every screen size.
    <section className="flex min-h-[calc(100vh-53px)] flex-col bg-surface">
      <div className="flex w-full flex-1 items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[440px]">
          <div className="mb-8 text-center">
            <p className="mb-2 text-[0.72rem] font-semibold uppercase tracking-wide text-accent">Welcome back</p>
            <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Sign in to your account
            </h1>
            <p className="mt-3 text-base text-ink-soft">
              Pick up your journey right where you left off.
            </p>
          </div>

          <AuthCard>
            <form onSubmit={handleSubmit} className="grid gap-5">
              {error && (
                <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className={labelClass}>Email address</label>
                <div className={inputWrap}>
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

              <div className="flex flex-col gap-2">
                <label htmlFor="password" className={labelClass}>Password</label>
                <div className={inputWrap}>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="Your password"
                    value={form.password}
                    onChange={handleChange}
                    className={inputField}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-1 w-full rounded-lg bg-navy py-4 font-semibold text-white transition hover:bg-[#1b2a57] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            <p className="mt-6 text-center text-[0.82rem] text-ink-soft">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="font-semibold text-accent-dark hover:underline">
                Sign up
              </Link>
            </p>
          </AuthCard>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;