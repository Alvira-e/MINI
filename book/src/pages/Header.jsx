import React, { useState } from 'react';
import { Search, ShoppingCart, User, BookOpen, Home } from 'lucide-react';
import { useAppContext } from './AppContext';
import { Link } from 'react-router-dom';

const Header = () => {
  const { user, getCartItemCount, searchQuery, setSearchQuery, logout } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-blue-400 text-black shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <BookOpen className="h-8 w-8" />
            <Link to="/" className="text-xl font-bold cursor-pointer">
              BookStore
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="flex items-center space-x-1 hover:text-orange-200"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/categories"
              className="hover:text-orange-200"
            >
              Categories
            </Link>
            <Link
              to="/cart"
              className="flex items-center space-x-1 hover:text-orange-200 relative"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Cart</span>
              {getCartItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>{user.email}</span>
                </div>
                <button
                  onClick={logout}
                  className="text-sm hover:text-orange-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/signin"
                className="flex items-center space-x-1 hover:text-orange-200"
              >
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;