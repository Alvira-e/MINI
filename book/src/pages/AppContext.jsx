import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Remove Link, keep useNavigate

// Context for global state management
const AppContext = createContext();
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// App Provider Component
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // change endpoint to match backend route and map _id -> id
        const response = await fetch('/api/book/getbooks');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // normalize ids to `id` so front-end code works consistently
        setBooks(data.map(b => ({ ...b, id: b._id || b.id })));
      } catch (error) {
        console.error("Could not fetch books:", error);
      }
    };

    fetchBooks();
  }, []); // The empty dependency array ensures this effect runs only once on mount

  const navigate = useNavigate(); // <-- Use this for navigation

  const login = (userData) => {
    setUser(userData);
    navigate('/'); // Redirect to home after login
  };

  const logout = () => {
    setUser(null);
    navigate('/'); // Redirect to home after logout
  };

  const addToCart = (book) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === book.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...book, quantity: 1 }];
    });
  };

  const removeFromCart = (bookId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== bookId));
  };

  const updateQuantity = (bookId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === bookId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...new Set(books.map(book => book.category))];

  return (
    <AppContext.Provider value={{
      user,
      cart,
      searchQuery,
      selectedCategory,
      books: filteredBooks,
      categories,
      login,
      logout,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartItemCount,
      setSearchQuery,
      setSelectedCategory
    }}>
      {children}
    </AppContext.Provider>
  );
};