import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Remove Link, keep useNavigate

// Sample book data (added `stock` field)
const sampleBooks = [
  {
    id: 1,
    title: "White Nights",
    author: "Ronald Meyer",
    price: 299,
    category: "Fiction",
    rating: 4.5,
    image: "",
    stock: 5,
    description: "A timeless classic about the American Dream in the Jazz Age."
  },
  {
    id: 2,
    title: "A Love Song for Ricki Wilde",
    author: "Tia Williams",
    price: 499,
    category: "Romance",
    rating: 4.8,
    image: "",
    stock: 3,
    description: "A gripping tale of racial injustice and childhood innocence."
  },
  {
    id: 3,
    title: "Bipin: The Man Behind The Uniform",
    author: "Rachna Bisht",
    price: 350,
    category: "Biography",
    rating: 4.2,
    image: "",
    stock: 4,
    description: "A controversial novel about teenage rebellion and alienation."
  },
  {
    id: 4,
    title: "Engineering Metrology",
    author: "R.K. Jain",
    price: 599,
    category: "Technology",
    rating: 4.7,
    image: "",
    stock: 2,
    description: "Epic science fiction saga set on the desert planet Arrakis."
  },
  {
    id: 5,
    title: "Empires of the Sea",
    author: "Radhika Seshan",
    price: 299,
    category: "History",
    rating: 4.6,
    image: "",
    stock: 6,
    description: "A romantic novel about manners, marriage, and social class."
  },
  {
    id: 6,
    title: "Dictionary of Pollution",
    author: "J.L Sharma",
    price: 399,
    category: "Environment",
    rating: 4.8,
    image: "",
    stock: 5,
    description: "A dystopian novel about totalitarianism and surveillance."
  },
  {
    id: 7,
    title: "Handbook on Mediation",
    author: "Nandini Gore",
    price: 599,
    category: "Law",
    rating: 4.9,
    image: "",
    stock: 4,
    description: "A fantasy adventure about Bilbo Baggins' unexpected journey."
  },
  {
    id: 8,
    title: "Strangers in Time",
    author: "David MacMillan",
    price: 650,
    category: "Fiction",
    rating: 4.8,
    image: "",
    stock: 3,
    description: "The magical story of a young wizard's journey begins."
  },
  {
    id: 9,
    title: "If i Were You",
    author: "Cesca Major",
    price: 499,
    category: "Romance",
    rating: 4.8,
    image: "",
    stock: 4,
    description: "A gripping tale of racial injustice and childhood innocence."
  },
  {
    id: 10,
    title: "Francis of Assissi",
    author: "Rhyss Bezzant",
    price: 499,
    category: "Biography",
    rating: 4.8,
    image: "",
    stock: 2,
    description: "A gripping tale of racial injustice and childhood innocence."
  },
  {
    id: 11,
    title: "History of Medival India",
    author: "V.D Mahajan",
    price: 499,
    category: "History",
    rating: 4.8,
    image: "",
    stock: 7,
    description: "A gripping tale of racial injustice and childhood innocence."
  },
  {
    id: 12,
    title: "Electric Machines",
    author: "P.S Bimbhra",
    price: 499,
    category: "Technology",
    rating: 4.8,
    image: "",
    stock: 3,
    description: "A gripping tale of racial injustice and childhood innocence."
  },
  {
    id: 13,
    title: "Little Rainmaker",
    author: "Roopal kewalya",
    price: 499,
    category: "Environment",
    rating: 4.8,
    image: "",
    stock: 5,
    description: "A gripping tale of racial injustice and childhood innocence."
  },
  {
    id: 14,
    title: "Lawmann's Notices",
    author: "K.M Sharma",
    price: 499,
    category: "Law",
    rating: 4.8,
    image: "",
    stock: 4,
    description: "A gripping tale of racial injustice and childhood innocence."
  },
  {
    id: 15,
    title: "Invisible Helix",
    author: "Keigo Higashino",
    price: 299,
    category: "Fiction",
    rating: 4.5,
    image: "",
    stock: 6,
    description: "A timeless classic about the American Dream in the Jazz Age."
  },
  {
    id: 16,
    title: "Finding Hayes",
    author: "Laura Pavlov",
    price: 499,
    category: "Romance",
    rating: 4.8,
    image: "",
    stock: 3,
    description: "A gripping tale of racial injustice and childhood innocence."
  },
  {
    id: 17,
    title: "Iruvudella Bittu",
    author: "Prakash Rai",
    price: 350,
    category: "Biography",
    rating: 4.2,
    image: "",
    stock: 5,
    description: "A controversial novel about teenage rebellion and alienation."
  },
  {
    id: 18,
    title: "Strength of Materials",
    author: "Timoshenko",
    price: 599,
    category: "Technology",
    rating: 4.7,
    image: "",
    stock: 2,
    description: "Epic science fiction saga set on the desert planet Arrakis."
  },
  {
    id: 19,
    title: "Emporer of Rome",
    author: "Mary Beard",
    price: 299,
    category: "History",
    rating: 4.6,
    image: "",
    stock: 4,
    description: "A romantic novel about manners, marriage, and social class."
  },
  {
    id: 20,
    title: "Healing Waters",
    author: "Notion Press",
    price: 399,
    category: "Environment",
    rating: 4.8,
    image: "",
    stock: 6,
    description: "A dystopian novel about totalitarianism and surveillance."
  },
  {
    id: 21,
    title: "Law of Property",
    author: "D.R SR Myneni",
    price: 599,
    category: "Law",
    rating: 4.9,
    image: "",
    stock: 3,
    description: "A fantasy adventure about Bilbo Baggins' unexpected journey."
  },
  {
    id: 22,
    title: "God of Fury",
    author: "Rina Kent",
    price: 650,
    category: "Fiction",
    rating: 4.8,
    image: "",
    stock: 2,
    description: "The magical story of a young wizard's journey begins."
  },
  {
    id: 23,
    title: "Give Me Butterflies",
    author: "Jullian Meadows",
    price: 499,
    category: "Romance",
    rating: 4.8,
    image: "",
    stock: 4,
    description: "A gripping tale of racial injustice and childhood innocence."
  },
  {
    id: 24,
    title: "Lincoln the Unknown",
    author: "Dale Carneigie",
    price: 499,
    category: "Biography",
    rating: 4.8,
    image: "",
    stock: 3,
    description: "A gripping tale of racial injustice and childhood innocence."
  },
  {
    id: 25,
    title: "Hope in the Dark",
    author: "Rebecca Solnit",
    price: 499,
    category: "History",
    rating: 4.8,
    image: "",
    stock: 5,
    description: "A gripping tale of racial injustice and childhood innocence."
  },
  {
    id: 26,
    title: "Problem in Engineering Mechanics",
    author: "Bhaskar Gupta",
    price: 499,
    category: "Technology",
    rating: 4.8,
    image: "",
    stock: 4,
    description: "A gripping tale of racial injustice and childhood innocence."
  },
  {
    id: 27,
    title: "Born Free",
    author: "Joy Adamson",
    price: 499,
    category: "Environment",
    rating: 4.8,
    image: "",
    stock: 6,
    description: "A gripping tale of racial injustice and childhood innocence."
  },
  {
    id: 28,
    title: "Constitution of India",
    author: "p.M Bakshi",
    price: 499,
    category: "Law",
    rating: 4.8,
    image: "",
    stock: 5,
    description: "A gripping tale of racial injustice and childhood innocence."
  },
];

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
  const [books, setBooks] = useState(sampleBooks); // <-- now writable to update stock

  const navigate = useNavigate(); // <-- Use this for navigation

  const login = (userData) => {
    setUser(userData);
    navigate('/'); // Redirect to home after login
  };

  const logout = () => {
    setUser(null);
    navigate('/'); // Redirect to home after logout
  };

  // helper to change stock (delta can be negative to reduce stock)
  const updateBookStock = (bookId, delta) => {
    setBooks(prev => prev.map(b =>
      b.id === bookId ? { ...b, stock: Math.max(0, (b.stock || 0) + delta) } : b
    ));
  };

  const addToCart = (book) => {
    const storeBook = books.find(b => b.id === book.id);
    if (!storeBook || (storeBook.stock || 0) <= 0) {
      // no stock available
      return;
    }
    updateBookStock(book.id, -1);
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === book.id);
      if (existingItem) {
        // increment quantity only if stock available
        if ((storeBook.stock || 0) <= 0) return prevCart;
        // updateBookStock(book.id, -1);
        return prevCart.map(item =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // new item
      
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
        const available = storeBook ? (storeBook.stock || 0) : 0;
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
    // restore stocks for all items in cart
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