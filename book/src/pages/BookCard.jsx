import React from 'react';
import { Star } from 'lucide-react';
import { useAppContext } from './AppContext';

const BookCard = ({ book }) => {
  const { addToCart } = useAppContext();
    const inStock = (book.stocks || 0) > 0;


  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-orange-100">
      <img
        src={book.image}
        alt={book.title}
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 line-clamp-2 text-gray-800">{book.title}</h3>
        <p className="text-gray-600 mb-2">{book.author}</p>
        <p className="text-sm text-gray-500 mb-2">{book.category}</p>
        <div className="flex items-center mb-2">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm text-gray-600 ml-1">{book.rating}</span>
        </div>
        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{book.description}</p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500">Stock: <span className={inStock ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>{book.stocks || 0}</span></span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-orange-600">₹ {book.price}</span>
          <button
            onClick={() => inStock && addToCart(book)}
            disabled={!inStock}
            className={`px-4 py-2 rounded transition-colors ${inStock ? 'bg-blue-400 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
          >
            {inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;