import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { BookOpen, ShoppingCart, User, LogIn, LogOut, Search, ShieldCheck } from 'lucide-react';
import { useAppContext } from './AppContext';

const Header = () => {
  const { user, logout, getCartItemCount, searchQuery, setSearchQuery } = useAppContext();
  const cartItemCount = getCartItemCount();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <header className="bg-blue-900 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="text-orange-400" size={28} />
          <span className="text-2xl font-bold">BookStore</span>
        </Link>

        <div className="hidden md:flex items-center bg-white rounded-md w-1/3">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full px-4 py-2 text-gray-800 rounded-l-md focus:outline-none"
          />
          <Search className="text-gray-500 mx-2" size={20} />
        </div>

        <nav className="flex items-center gap-4">
          <NavLink to="/" className={({ isActive }) => `hover:text-orange-400 transition-colors ${isActive ? 'text-orange-400' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/categories" className={({ isActive }) => `hover:text-orange-400 transition-colors ${isActive ? 'text-orange-400' : ''}`}>
            Categories
          </NavLink>

          {/* Conditionally render Admin link */}
          {user && user.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => `flex items-center gap-1 hover:text-orange-400 transition-colors ${isActive ? 'text-orange-400' : ''}`}>
              <ShieldCheck size={18} />
              Admin
            </NavLink>
          )}

          <Link to="/cart" className="relative hover:text-orange-400 transition-colors">
            <ShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <User size={20} /> {user.username}
              </span>
              <button onClick={logout} className="flex items-center gap-1 hover:text-orange-400 transition-colors">
                <LogOut size={20} />
                Logout
              </button>
            </div>
          ) : (
            <Link to="/signin" className="flex items-center gap-1 hover:text-orange-400 transition-colors">
              <LogIn size={20} /> Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;