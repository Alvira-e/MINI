import React from 'react';
import { useAppContext } from './AppContext';
import BookCard from './BookCard';

const CategoriesPage = () => {
  const { books, categories, selectedCategory, setSelectedCategory } = useAppContext();

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Browse by Category</h2>
      
      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-400 text-white'
                  : 'bg-blue-900 text-white hover:bg-blue-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {books.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No books found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;