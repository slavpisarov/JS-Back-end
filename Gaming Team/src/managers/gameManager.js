const Game = require('../models/Game');

exports.create = (gameData) => Game.create(gameData);

exports.getAll = () => Game.find().populate();

exports.getOne = (gameId) => Game.findById(gameId);

exports.delete = (gameId) => Game.findByIdAndDelete(gameId);

exports.edit = (gameId, dameData) => Game.findByIdAndUpdate(gameId, dameData);

exports.search = async (name, platform) => {
    const allGames = await Game.find().lean();

    if (name && !platform) {
        return allGames.filter(game => game.name.toLowerCase().includes(name.toLowerCase()));

    } else if (!name && platform) {
        return allGames.filter(game => game.platform == platform);

    } else {
        return allGames.filter(game => (game.name.toLowerCase().includes(name.toLowerCase()) && game.platform == platform));
    }

};

exports.buy = async (gameId, userId) =>{
    const game = await Game.findById(gameId);

    game.boughtBy.push(userId);
    return game.save();
}




