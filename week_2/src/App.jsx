import Header from './components/Header';
import Hero from './components/Hero';
import TourGrid from './components/TourGrid';
import Testimonials from './components/Testimonials';
import QuoteSection from './components/QuoteSection';
import Footer from './components/Footer';

// App only composes the page. Each section is its own component.
// Data flow: tours.js -> TourGrid -> TourCard -> QuantityStepper (props go down).
function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TourGrid />
        <Testimonials />
        <QuoteSection />
      </main>
      <Footer />
    </>
  );
}

export default App;
