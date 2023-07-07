const router = require('express').Router();

const animalManager = require('../managers/animalManager');
const { getErrorMessage } = require('../utils/errorHelpers')
const { isAuth } = require('../middlewares/authMiddleware');



router.get('/create',isAuth, (req, res) => {
    res.render('animals/create')
});

router.post('/create',isAuth, async (req, res) => {

    const animalData = {
        ...req.body,
        owner: req.user._id,
    }
    try {
        await animalManager.create(animalData);

        res.redirect('/animals/catalog');
    } catch (err) {
        res.render('animals/create', { error: getErrorMessage(err) })
    }
});


router.get('/catalog', async (req, res) => {
    try {
        const animals = await animalManager.getAll().lean();

        console.log(animals)

        res.render('animals/dashboard', { animals });

    } catch (err) {
        console.log(err);
        
      res.render('404', { error: getErrorMessage(err) })

    }
});

router.get('/:animalId/details', async (req, res) => {

    const animalId = req.params.animalId;
    try {
        const animal = await animalManager.getOne(animalId).lean();
        const isOwner = req.user?._id == animal.owner._id;
        let didUserDonate = false;

        animal.donations.forEach(id => {
            if(id == req.user?._id){
                didUserDonate = true
            }
        });

        const seeDonateBtn = !isOwner && !didUserDonate && res.locals.isAuthenticated;
        const seeDonatedMessage = didUserDonate && !isOwner && res.locals.isAuthenticated;

        res.render('animals/details', { animal, isOwner, seeDonateBtn, seeDonatedMessage});

    } catch (err) {
        console.log(err)
        res.render('games/catalog', { error: 'Cannot get game details' })
    }
});

router.get('/:animalId/delete',isAuth, async (req, res) => {

    const animalId = req.params.animalId;

    try {
        await animalManager.delete(animalId);

        res.redirect('/animals/catalog')
    } catch (err) {
      res.render('404', { error: getErrorMessage(err) })
    }
});

router.get('/:animalId/edit',isAuth, async (req, res) => {

    const animalId = req.params.animalId;

    try {
        const animal = await animalManager.getOne(animalId).lean();

        res.render('animals/edit', { animal })
    } catch (err) {
        res.render('404', {error: 'Cannot edit animal'})
    }
});

router.post('/:animalId/edit', async (req, res) => {

    const animalId = req.params.animalId;
    const animalData = req.body;

    try {
        await animalManager.edit(animalId,animalData);

        res.redirect(`/animals/${animalId}/details`)
    } catch (err) {
        res.render('404', {error: getErrorMessage(err)})
    }
});

router.get('/:animalId/buy',isAuth, async (req, res) => {

    const animalId = req.params.animalId;
    const userId = req.user._id;

    try {
        await animalManager.buy(animalId, userId);

        res.redirect(`/animals/${animalId}/details`);

    } catch (err) {
        res.redirect(`/animals/${animalId}/details`, { error: getErrorMessage(err) })
    }
});


module.exports = router;
