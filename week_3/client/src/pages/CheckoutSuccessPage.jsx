import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Container from '../components/Container';
import { CheckIcon, ClockIcon } from '../components/Icons';

function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const sessionId = searchParams.get('session_id');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId || sessionId === 'success') {
      setLoading(false);
      setError('Invalid session ID');
      return;
    }

    async function fetchOrder() {
      try {
        const data = await api.getOrder(sessionId);
        setOrder(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [sessionId]);

  if (loading) {
    return (
      <section className="bg-navy min-h-screen py-16 text-white">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-4 text-accent">Loading your order...</p>
          </div>
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-navy min-h-screen py-16 text-white">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-display text-3xl font-bold text-white mb-4">
              Something went wrong
            </h1>
            <p className="text-white/80 mb-6">{error}</p>
            <Link
              to="/"
              className="inline-block rounded-lg bg-accent px-6 py-3 font-semibold text-white transition hover:bg-accent-dark"
            >
              Return Home
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: order?.currency || 'USD',
    }).format(amount || 0);
  };

  return (
    <section className="bg-navy min-h-screen py-16 text-white">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-900/30 border border-green-500/50">
              <CheckIcon size={32} className="text-green-400" />
            </div>
            <h1 className="font-display text-4xl font-bold text-white mb-4">
              Thank you for your booking!
            </h1>
            <p className="text-white/80 max-w-lg">
              Your payment was successful. A confirmation email has been sent to{' '}
              <strong className="text-accent">{user?.email}</strong>.
            </p>
          </div>

          {order && (
            <>
              <div className="rounded-xl bg-white p-6 text-ink shadow-2xl mb-8">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">
                  Order Summary
                </h2>
                <div className="mb-4">
                  <p className="text-sm text-ink-soft">Checkout Session</p>
                  <p className="font-mono text-xs text-ink-muted break-all">
                    {order.checkoutSessionId?.substring(0, 20)}...
                  </p>
                </div>
                <div className="border-t border-line pt-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-semibold text-ink">Total</span>
                    <span className="text-2xl font-bold text-accent">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                  {order.items && (
                    <ul className="mt-4 space-y-3">
                      {Array.isArray(order.items) ? order.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between text-sm">
                          <span className="text-ink-soft">{item.itemId}</span>
                          <span className="text-ink">x{item.quantity}</span>
                        </li>
                      )) : (
                        <li className="text-ink">
                          {typeof order.items === 'string'
                            ? 'See your email for details'
                            : 'Order confirmed'}
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </div>

              <div className="rounded-xl bg-white/5 p-6 text-white mb-8">
                <h3 className="font-display text-lg font-bold text-white mb-3">
                  What's next?
                </h3>
                <ul className="space-y-3 text-white/80">
                  <li className="flex items-start gap-3">
                    <ClockIcon size={18} className="mt-0.5 flex-shrink-0 text-accent" />
                    <span>Check your email for a detailed receipt and itinerary details</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckIcon size={18} className="mt-0.5 flex-shrink-0 text-accent" />
                    <span>Our travel consultants will contact you within 24 hours</span>
                  </li>
                </ul>
              </div>
            </>
          )}

          <div className="text-center space-y-4">
            <Link
              to="/"
              className="inline-block rounded-lg bg-navy px-6 py-3 font-semibold text-white transition hover:bg-[#1b2a57]"
            >
              Continue Exploring
            </Link>
            {user && (
              <div>
                <Link
                  to="/packages"
                  className="inline-block text-accent transition hover:underline"
                >
                  Browse more packages
                </Link>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default CheckoutSuccessPage;