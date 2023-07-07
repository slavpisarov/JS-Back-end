const router = require('express').Router();

const gameManager = require('../managers/gameManager');
const { getErrorMessage } = require('../utils/errorHelpers')

router.get('/', (req, res) => {
    res.render('home')
});

router.get('/404', (req, res) => {
    res.render('404')
});

router.get('/search', async (req, res) => {
    const games = await gameManager.getAll().lean();
    res.render('search', { games })
});

router.post('/search', async (req, res) => {
    const name = req.body.name;
    const platform = req.body.platform;

    let games;

    if (!name && !platform) {
        games = await gameManager.getAll().lean();
    } else {
        games = await gameManager.search(name, platform);
    }

    res.render('search', { games })
});

module.exports = router;
