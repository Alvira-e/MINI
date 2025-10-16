import mongoose from "mongoose";

const BookScheme  = new mongoose.schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

const Book = mongoose.model('Book', BookScheme);

export default Book;