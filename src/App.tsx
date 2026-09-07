import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import ProductPage from '@/pages/ProductPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import ReviewsPage from '@/pages/ReviewsPage';
import PrivacyPage from '@/pages/PrivacyPage';
import ReturnsPage from '@/pages/ReturnsPage';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';

function ScrollToHash() {
  const { hash, pathname } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [hash, pathname]);
  return null;
}

function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <ScrollToHash />
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route
            path="/"
            element={
              <StoreLayout>
                <HomePage />
              </StoreLayout>
            }
          />
          <Route
            path="/product/:id"
            element={
              <StoreLayout>
                <ProductPage />
              </StoreLayout>
            }
          />
          <Route
            path="/cart"
            element={
              <StoreLayout>
                <CartPage />
              </StoreLayout>
            }
          />
          <Route
            path="/checkout"
            element={
              <StoreLayout>
                <CheckoutPage />
              </StoreLayout>
            }
          />
          <Route
            path="/reviews"
            element={
              <StoreLayout>
                <ReviewsPage />
              </StoreLayout>
            }
          />
          <Route
            path="/privacy"
            element={
              <StoreLayout>
                <PrivacyPage />
              </StoreLayout>
            }
          />
          <Route
            path="/returns"
            element={
              <StoreLayout>
                <ReturnsPage />
              </StoreLayout>
            }
          />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}
