const router = require('express').Router();

const gameManager = require('../managers/gameManager');
const { getErrorMessage } = require('../utils/errorHelpers')


router.get('/create', (req, res) => {
    res.render('games/create')
});

router.post('/create', async (req, res) => {

    const gameData = {
        ...req.body,
        owner: req.user._id,
    }
    try {
        await gameManager.create(gameData);

        res.redirect('/games/catalog');
    } catch (err) {
        res.render('games/create', { error: getErrorMessage(err) })
    }
});

router.get('/catalog', async (req, res) => {
    try {
        const games = await gameManager.getAll().lean();

        res.render('games/catalog', { games });

    } catch (err) {
        console.log(err);
    }
});

router.get('/:gameId/details', async (req, res) => {

    const gameId = req.params.gameId;
    try {
        const game = await gameManager.getOne(gameId).lean();
        const isOwner = req.user?._id == game.owner._id;
        let didUserBuy = false;

        game.boughtBy.forEach(id => {
            if(id == req.user?._id){
                didUserBuy = true
            }
        });

        const seeBuyBtn = !isOwner && !didUserBuy && res.locals.isAuthenticated;
        const seeBoughtMessage = didUserBuy && !isOwner && res.locals.isAuthenticated;

        res.render('games/details', { game, isOwner, seeBuyBtn, seeBoughtMessage });

    } catch (err) {
        console.log(err)
        res.render('games/catalog', { error: 'Cannot get game details' })
    }
});

router.get('/:gameId/delete', async (req, res) => {

    const gameId = req.params.gameId;

    try {
        await gameManager.delete(gameId);

        res.redirect('/games/catalog')
    } catch (err) {
        res.render(`games/details`, {error: 'Game deletion failed'})
    }
});

router.get('/:gameId/edit', async (req, res) => {

    const gameId = req.params.gameId;

    try {
        const game = await gameManager.getOne(gameId).lean();

        res.render('games/edit', { game })
    } catch (err) {
        res.render(`games/details`, {error: 'Cannot edit game'})
    }
});

router.post('/:gameId/edit', async (req, res) => {

    const gameId = req.params.gameId;
    const gameData = req.body;

    try {
        await gameManager.edit(gameId,gameData);

        res.redirect(`/games/${gameId}/details`)
    } catch (err) {
        console.log(err)
        res.render(`games/edit`, {error: 'Cannot edit game', ...gameData})
    }
});

router.get('/:gameId/buy', async (req, res) => {

    const gameId = req.params.gameId;
    const userId = req.user._id;

    try {
        await gameManager.buy(gameId, userId);

        res.redirect(`/games/${gameId}/details`);

    } catch (err) {
        console.log(err)
        res.redirect(`/games/${gameId}/details`, { error: getErrorMessage(err) })
    }
});




module.exports = router;
