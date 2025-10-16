import { AppProvider, useAppContext } from './AppContext';
import Header from './Header';
import Footer from './Footer';
// Main App Component
const App = () => {
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