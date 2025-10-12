import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Remove Link, keep useNavigate

// Sample book data 
const sampleBooks = [
  {
    id: 1,
    title: "White Nights",
    author: "Ronald Meyer",
    price: 299,
    category: "Fiction",
    rating: 4.5,
    image: "",
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
  const [books] = useState(sampleBooks);

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