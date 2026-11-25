import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PackagesPage from './pages/PackagesPage';
import TestimonialsPage from './pages/TestimonialsPage';
import PlanTripPage from './pages/PlanTripPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage';
import CheckoutCancelPage from './pages/CheckoutCancelPage';
import { AuthProvider } from './context/AuthContext';

// App wires the AuthProvider (session state) into the router.
// Auth pages are intentionally full-screen (no header/footer) so the form
// is the only thing the user sees.
// Week 4 adds checkout success/cancel pages.
function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isCheckoutPage = location.pathname === '/checkout/success' || location.pathname === '/checkout/cancel';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      {!isAuthPage && !isCheckoutPage && <Header />}
      <main className={isAuthPage || isCheckoutPage ? 'flex-1' : ''}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/quote" element={<PlanTripPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
          <Route path="/checkout/cancel" element={<CheckoutCancelPage />} />
        </Routes>
      </main>
      {!isAuthPage && !isCheckoutPage && <Footer />}
    </div>
  );
}

export default function AppWithProviders() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}