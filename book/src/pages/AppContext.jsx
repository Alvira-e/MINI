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
        const response = await fetch('/api/book/getbooks');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const API_ORIGIN = process.env.REACT_APP_API_URL || 'http://localhost:3001';
        const normalized = data.map(b => ({
          ...b,
          id: b._id || b.id,
          image: b.image ? (b.image.startsWith('http') ? b.image : `${API_ORIGIN}/${b.image.replace(/^\/+/, '')}`) : null,
          stocks: Number(b.stocks || 0)
        }));
        setBooks(normalized);
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

  const updateBookStock = async (bookId, delta) => {
    // Optimistic update: capture previous state for rollback
    let previousStocks;
    setBooks(prev => {
      return prev.map(b => {
        if (b.id === bookId) {
          previousStocks = (b.stocks || 0);
          return { ...b, stocks: Math.max(0, previousStocks + delta) };
        }
        return b;
      });
    });

    try {
      const response = await fetch(`/api/book/stocks/${bookId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        // if backend gives a message, prefer it
        const msg = data?.message || `HTTP error! status: ${response.status}`;
        throw new Error(msg);
      }

      // if server returned updated book, sync it (normalize id)
      if (data && data.book) {
        const updatedBook = { ...data.book, id: data.book._id || data.book.id };
        setBooks(prev => prev.map(b => b.id === bookId ? { ...b, ...updatedBook } : b));
      }

    } catch (error) {
      console.error("Could not update book stock:", error);
      // rollback to previousStocks
      setBooks(prev => prev.map(b => b.id === bookId ? { ...b, stocks: Math.max(0, previousStocks ?? (b.stocks || 0)) } : b));
      throw error; // re-throw so callers can show errors
    }
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

  // expose a reload function so pages (checkout) can refresh book data after backend changes
  const reloadBooks = async () => {
    try {
      const response = await fetch('/api/book/getbooks');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const API_ORIGIN = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const normalized = data.map(b => ({
        ...b,
        id: b._id || b.id,
        image: b.image ? (b.image.startsWith('http') ? b.image : `${API_ORIGIN}/${b.image.replace(/^\/+/, '')}`) : null,
        stocks: Number(b.stocks || 0)
      }));
      setBooks(normalized);
    } catch (err) {
      console.error('reloadBooks failed:', err);
    }
  };

  // clearCart: if restoreStocks === true, return items to stock; when called after successful checkout use false
  const clearCart = (restoreStocks = true) => {
    if (restoreStocks) {
      cart.forEach(item => updateBookStock(item.id, item.quantity));
    }
    setCart([]);
  };

  const addBook = async (bookFormData) => {
    try {
      const response = await fetch('/api/book/addbook', {
        method: 'POST',
        body: bookFormData,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { book: newBook } = await response.json();
      // normalize id and add to state
      setBooks(prev => [...prev, { ...newBook, id: newBook._id }]);
      return newBook;
    } catch (error) {
      console.error("Could not add book:", error);
      throw error; // re-throw to be caught in the component
    }
  };

  const deleteBook = async (bookId) => {
    try {
      const response = await fetch(`/api/book/${bookId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setBooks(prev => prev.filter(b => b.id !== bookId));
    } catch (error) {
      console.error("Could not delete book:", error);
      throw error;
    }
  };

  const updateBook = async (bookId, bookFormData) => {
  try {
    const response = await fetch(`/api/book/${bookId}`, {
      method: 'PUT',
      body: bookFormData, // Send FormData directly
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { book: updatedBook } = await response.json();
    const normalized = { ...updatedBook, id: updatedBook._id || updatedBook.id };

    setBooks(prev =>
      prev.map(b => (b.id === bookId ? { ...b, ...normalized } : b))
    );

    return normalized;
  } catch (error) {
    console.error('Could not update book:', error);
    throw error;
  }
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
      addBook,
      deleteBook,
      updateBook,
      updateBookStock,
      rawBooks: books,
      reloadBooks  // <-- exported
    }}>
      {children}
    </AppContext.Provider>
  );
};