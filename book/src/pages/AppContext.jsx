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
 
// App Provider 
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [books, setBooks] = useState([]); // <-- now writable to update stock

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

  const updateBookStock = (bookId, delta) => {
    setBooks(prev => prev.map(b =>
      b.id === bookId ? { ...b, stocks: Math.max(0, (b.stocks || 0) + delta) } : b
    ));
  };

  const addToCart = (book) => {
    const storeBook = books.find(b => b.id === book.id);
    if (!storeBook || (storeBook.stocks || 0) <= 0) {
      // no stock available
      return;
    }
    updateBookStock(book.id, -1);
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === book.id);
      if (existingItem) { // This check is redundant here because it's already done above.
        if ((storeBook.stocks || 0) <= 0) return prevCart; // This check is also redundant.
        return prevCart.map(item =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...book, quantity: 1 }];
    });
  };

  const removeFromCart = (bookId) => {
    setCart(prevCart => {
      const item = prevCart.find(i => i.id === bookId);
      if (item) {
        // restore stock
        updateBookStock(bookId, item.quantity);
      }
      return prevCart.filter(item => item.id !== bookId);
    });
  };

  const updateQuantity = (bookId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setCart(prevCart => {
      const item = prevCart.find(i => i.id === bookId);
      if (!item) return prevCart;

      const diff = quantity - item.quantity;
      if (diff > 0) {
        const storeBook = books.find(b => b.id === bookId);
        const available = storeBook ? (storeBook.stocks || 0) : 0;
        const toAdd = Math.min(diff, available);
        if (toAdd <= 0) return prevCart;
        updateBookStock(bookId, -toAdd);
        return prevCart.map(i => i.id === bookId ? { ...i, quantity: i.quantity + toAdd } : i);
      } else if (diff < 0) {
        // returning stock
        updateBookStock(bookId, -diff); // -diff is positive
        return prevCart.map(i => i.id === bookId ? { ...i, quantity } : i);
      }
      return prevCart;
    });
  };

  const clearCart = () => {
    cart.forEach(item => updateBookStock(item.id, item.quantity));
    setCart([]);
  };

  const addBook = (newBook) => {
    setBooks(prev => [
      ...prev,
      {
        ...newBook,
        id: prev.length > 0 ? Math.max(...prev.map(b => b.id)) + 1 : 1, // Generate a new ID
      }
    ]);
  };

  const deleteBook = (bookId) => {
    setBooks(prev => prev.filter(b => b.id !== bookId));
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
      setSelectedCategory,
      // expose stock updater if needed by admin UI
      addBook,
      deleteBook,
      updateBookStock,
      rawBooks: books
    }}>
      {children}
    </AppContext.Provider>
  );
};