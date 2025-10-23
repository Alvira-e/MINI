import Book from '../models/book.model.js';

export const addbook = async (req, res, next) => {
    const { title, author, description, price, category, rating, stocks } = req.body;
    const image = req.file ? `uploads/${req.file.filename}` : null;

    try {
        const newBook = new Book({
            title,
            author,
            description,
            price,
            category,
            rating,
            image,
            stocks
        });

        await newBook.save();
        res.status(201).json({ message: 'Book added successfully', book: newBook });
    } catch (error) {
        next(error);
    }
};

export const getBooks = async (req, res, next) => {
    try {
        const books = await Book.find({});
        res.status(200).json(books);
    } catch (error) {
        next(error);
    }
};

export const removebook = async (req, res, next) => {
    const { id } = req.params;

    try {
        const deletedBook = await Book.findByIdAndDelete(id);
        if (!deletedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        // fixed malformed response
        res.status(200).json({ message: 'Book deleted successfully', book: deletedBook });
    } catch (error) {
        next(error);
    }
};

export const adjustStock = async (req, res, next) => {
  const { id } = req.params;
  const delta = Number(req.body.delta || 0);
  try {
    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // compute new stock and clamp to 0+
    book.stocks = Math.max(0, (Number(book.stocks) || 0) + delta);

    await book.save();

    return res.status(200).json({ message: 'Stock updated', book });
  } catch (error) {
    next(error);
  }
};