const Crypto = require('../models/Crypto');

exports.create = (cryptoData) => Crypto.create(cryptoData);

exports.getAll = () => Crypto.find();

exports.getOne = (cryptoId) => Crypto.findById(cryptoId);

exports.delete = (cryptoId) => Crypto.findByIdAndDelete(cryptoId);

exports.edit = (cryptoId, cryptoData) => Crypto.findByIdAndUpdate(cryptoId, cryptoData);

exports.search = async (search, payment) => {
    const allCrypto = await Crypto.find().lean();

    if (!search) {
        return allCrypto.filter(crypto => crypto.payment == payment);
    }
    return allCrypto.filter(crypto => (crypto.name.toLowerCase().includes(search.toLowerCase()) && crypto.payment == payment));

};

exports.buy = async (cryptoId, userId) =>{
    const crypto = await Crypto.findById(cryptoId);

    crypto.boughtBy.push(userId);
    return crypto.save();
}





