import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Container from '../components/Container';
import { XIcon, ShoppingCartIcon } from '../components/Icons';

function CheckoutCancelPage() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const sessionId = searchParams.get('session_id');

  return (
    <section className="bg-navy min-h-screen py-16 text-white">
      <Container>
        <div className="mx-auto max-w-2xl">
          <div className="mb-10 text-center">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-900/30 border border-red-500/50">
              <XIcon size={32} className="text-red-400" />
            </div>
            <h1 className="font-display text-4xl font-bold text-white mb-4">
              Payment Cancelled
            </h1>
            <p className="text-white/80 max-w-lg">
              Your payment was not completed. You can return to your adventure and
              complete the checkout later from your cart or package page.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 text-ink shadow-2xl mb-8">
            <div className="text-center space-y-4">
              <ShoppingCartIcon size={48} className="mx-auto text-navy" />
              <h2 className="font-display text-2xl font-bold text-ink">
                Ready to try again?
              </h2>
              <p className="text-ink-soft">
                Make sure your payment method is valid and you have enough funds.
              </p>

              {sessionId && (
                <p className="text-sm text-ink-muted">
                  Session ID: {sessionId.substring(0, 20)}...
                </p>
              )}
            </div>
          </div>

          <div className="text-center space-y-4">
            <Link
              to="/packages"
              className="inline-block rounded-lg bg-accent px-6 py-3 font-semibold text-white transition hover:bg-accent-dark"
            >
              Browse Packages
            </Link>
            <div>
              <Link
                to="/"
                className="inline-block text-white/80 transition hover:text-white"
              >
                ← Return to Home
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default CheckoutCancelPage;