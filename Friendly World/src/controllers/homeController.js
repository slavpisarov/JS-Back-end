const router = require('express').Router();

const animalManager = require('../managers/animalManager');

router.get('/',async (req,res) =>{

    const animals = await animalManager.getThree().lean();

    res.render('home',{ animals })

});

router.get('/404', (req,res) =>{
    res.render('404')
});

router.get('/search', async (req, res) => {
    const animals = await animalManager.getAll().lean();
    res.render('search', { animals })
});

router.post('/search', async (req, res) => {
    const search = req.body.search;

    try {
        const animals = await animalManager.search(search);

        res.render('search', { animals })
    } catch (err) {
        console.log(err)
    }

});

module.exports = router;
