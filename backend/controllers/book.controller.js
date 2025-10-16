import Book from '../models/book.model.js';

export const addbook = async (req, res, next) => {
    const { title, author, description, price, category, stocks } = req.body;
    const image = req.file ? req.file.path : null;

    try {
        const newBook = new Book({
            title,
            author,
            description,
            price,
            category,
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
        res.status(200).json({ message: 'Book deleted}) successfully', book: deletedBook });
    } catch (error) {
        next(error);
    }

}