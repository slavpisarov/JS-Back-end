const Book = require('../models/Book');

exports.create = (bookData) => Book.create(bookData);

exports.getAll = () => Book.find();

exports.getOne = (bookId) => Book.findById(bookId);

exports.delete = (bookId) => Book.findByIdAndDelete(bookId);

exports.update = (bookId,bookData) => Book.findByIdAndUpdate(bookId,bookData);

exports.wishlist = async (bookId, userId) => {
    const book = await Book.findById(bookId);

    book.wishlist.push(userId);

    return book.save();
}

exports.getUserWishlist = async (userId) => {
    const allBooks = await Book.find().populate('wishlist.ObjectId').lean();

    const userWishBooks = []

    allBooks.forEach(book => {
        const wishlistIds = book.wishlist;
        let isBookAdded = false;

        wishlistIds.map(id => id == userId ? isBookAdded = true : 'null');

        if(isBookAdded) userWishBooks.push(book);
    });

    return userWishBooks;

}




