import React from 'react';
import { AppProvider, useAppContext } from './AppContext';
import Header from './Header';
import Footer from './Footer';
import HomePage from './HomePage';
import CategoriesPage from './CategoriesPage';
import SignInPage from './SigninPage';
import SignUpPage from './SignUpPage';
import CartPage from './CartPage';
import CheckoutPage from './CheckoutPage';

// Main App Component
const App = () => {
  const { currentPage, user, logout } = useAppContext();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'categories':
        return <CategoriesPage />;
      case 'signin':
        return <SignInPage />;
      case 'signup':
        return <SignUpPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col">
      <Header />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

// Root Component with Provider
const Bookstore = () => {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
};

export default Bookstore;