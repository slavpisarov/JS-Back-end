const router = require('express').Router();

const cryptoManager = require('../managers/cryptoManager');

const { getErrorMessage } = require('../utils/errorHelpers')

router.get('/create', (req, res) => {
    res.render('crypto/create')
});

router.post('/create', async (req, res) => {

    const cryptoData = {
        ...req.body,
        owner: req.user._id,
    }
    try {
        await cryptoManager.create(cryptoData);

        res.redirect('/crypto/catalog');
    } catch (err) {
        res.render('crypto/create', { error: getErrorMessage(err) })
    }
});

router.get('/catalog', async (req, res) => {

    const crypto = await cryptoManager.getAll().lean();

    res.render('crypto/catalog', { crypto })
});

router.get('/:cryptoId/details', async (req, res) => {

    const cryptoId = req.params.cryptoId;
    try {
        const crypto = await cryptoManager.getOne(cryptoId).lean();

        const isOwner = req.user?._id == crypto.owner._id;
        let didUserBuy = false;

        crypto.boughtBy?.forEach(id => {
            if(id == req.user?._id){
                didUserBuy = true
            }
        });

        const seeBuyBtn = !isOwner && !didUserBuy && res.locals.isAuthenticated;
        const seeBoughtMessage = didUserBuy && !isOwner && res.locals.isAuthenticated;

        res.render('crypto/details', { crypto, isOwner, seeBuyBtn, seeBoughtMessage })
    } catch (err) {
        console.log(err);
        res.render('crypto/catalog', { error: getErrorMessage(err) })
    }
});

router.get('/:cryptoId/delete', async (req, res) => {
    const cryptoId = req.params.cryptoId;
    try {
        await cryptoManager.delete(cryptoId);
        res.redirect('/crypto/catalog')
    } catch (err) {
        res.render('crypto/details', { error: getErrorMessage(err) })
    }
});

router.get('/:cryptoId/edit', async (req, res) => {
    const cryptoId = req.params.cryptoId;
    try {
        const crypto = await cryptoManager.getOne(cryptoId).lean();

        res.render('crypto/edit', { crypto })

    } catch (err) {
        res.render('crypto/details', { error: getErrorMessage(err) })
    }
});

router.post('/:cryptoId/edit', async (req, res) => {
    const cryptoId = req.params.cryptoId;
    const cryptoData = req.body;

    try {
        const crypto = await cryptoManager.edit(cryptoId,cryptoData).lean();

        res.redirect(`/crypto/${cryptoId}/details`)

    } catch (err) {
        res.render('crypto/edit', { error: getErrorMessage(err) })
    }
});

router.get('/:cryptoId/buy', async (req, res) => {

    const cryptoId = req.params.cryptoId;
    const userId = req.user._id;

    try {
        await cryptoManager.buy(cryptoId, userId);

        res.redirect(`/crypto/${cryptoId}/details`);

    } catch (err) {
        res.redirect(`/crypto/${cryptoId}/details`, { error: getErrorMessage(err) })
    }
});

module.exports = router;
