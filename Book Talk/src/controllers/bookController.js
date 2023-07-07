const router = require('express').Router();

const bookManager = require('../managers/bookManager')
const { getErrorMessage } = require('../utils/errorHelpers')


router.get('/create', async (req, res) => {
    res.render('books/create');
});

router.post('/create', async (req, res) => {

    const bookData = {
        ...req.body,
        owner: req.user._id,
    }

    try {
        await bookManager.create(bookData);

        res.redirect('/books/catalog');
    } catch (err) {
        res.render('books/create', { error: getErrorMessage(err) })
    }
});

router.get('/catalog', async (req, res) => {
    const books = await bookManager.getAll().lean();
    res.render('books/catalog', { books });
});

router.get('/:bookId/details', async (req, res) => {
    const bookId = req.params.bookId;

    const book = await bookManager.getOne(bookId).lean();

    const isOwner = req.user?._id == book.owner._id;
    let didUserAdd = false;

    book.wishlist.forEach(id => {
        if(id == req.user?._id){
            didUserAdd = true
        }
    });

    const seeAddBtn = !isOwner && !didUserAdd && res.locals.isAuthenticated;
    const seeAlreadyAddedMessage = didUserAdd && !isOwner && res.locals.isAuthenticated;


    res.render('books/details', { book, isOwner,seeAddBtn, seeAlreadyAddedMessage });

});

router.get('/:bookId/delete', async (req, res) => {
    const bookId = req.params.bookId;

    try {
        await bookManager.delete(bookId);

        res.redirect('/books/catalog')
        
    } catch (err) {
        res.render('books/details', { error: "cannot delete book" })
        
    }

});

router.get('/:bookId/edit', async (req, res) => {
    const bookId = req.params.bookId;

    try {
        const book = await bookManager.getOne(bookId).lean();

        res.render('books/edit', {book});
    } catch (err) {
        console.log(err);
        res.render(`books/details`, {error: 'Cannot find book'})
    }

});

router.post('/:bookId/edit', async (req, res) => {
    const bookId = req.params.bookId;
    const bookData = req.body;

    try {
        await bookManager.update(bookId,bookData);

        res.redirect(`/books/${bookId}/details`);
    } catch (err) {
        res.render(`books/details`, {error: getErrorMessage(err)})
    }
});

router.get('/:bookId/wishlist', async (req, res) => {
    const bookId = req.params.bookId;
    const userId = req.user._id;
    
    try {
        await bookManager.wishlist(bookId, userId);

        res.redirect(`/books/${bookId}/details`);
    } catch (err) {
        res.redirect(`/books/${bookId}/details`, {error: getErrorMessage(err)})
    }

});





module.exports = router;
