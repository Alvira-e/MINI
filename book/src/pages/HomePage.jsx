import React from 'react';
import { useAppContext } from './AppContext';
import BookCard from './BookCard';

const HomePage = () => {
  const { books } = useAppContext();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="bg-blue-400 text-black font-bold rounded-lg p-8 mb-8">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-bold mb-4">Welcome to BookStore</h2>
          <p className="text-xl mb-6">
            Discover books across all genres. From fiction to non-fiction.<br></br>
            Find your next great read.
          </p>
        </div>
      </section>

      {/* Featured Books */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Featured Books</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.slice(0, 4).map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;