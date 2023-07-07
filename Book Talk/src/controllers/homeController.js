const router = require('express').Router();

const bookManager = require('../managers/bookManager')
const { getErrorMessage } = require('../utils/errorHelpers')

router.get('/', (req,res) =>{
    res.render('home')
});

router.get('/profile', async (req,res) =>{

    const user = req.user;
    try {
        const books = await bookManager.getUserWishlist(user._id)

        res.render('profile', {user, books})
    } catch (err) {
    console.log(err);        
    }

});

router.get('/404', (req,res) =>{
    res.render('404')
});

module.exports = router;
