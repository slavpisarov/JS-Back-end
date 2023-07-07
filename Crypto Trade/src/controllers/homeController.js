const router = require('express').Router();

const cryptoManager = require('../managers/cryptoManager');
const { getErrorMessage } = require('../utils/errorHelpers')

router.get('/', (req, res) => {
    res.render('home')
});

router.get('/404', (req,res) =>{
    res.render('404')
});

router.get('/search', async (req, res) => {

    const crypto = await cryptoManager.getAll().lean();

    res.render('search', { crypto })
});

router.post('/search', async (req, res) => {

    const search = req.body.search;
    const payment = req.body.payment;

    try {
        const crypto = await cryptoManager.search(search, payment);
    
        if (!crypto) return res.render('search', { crypto: [] });
        
        res.render('search', { crypto });

    } catch (err) {
        res.render('search', { error: getErrorMessage(err)})
        
    }


});


module.exports = router;
