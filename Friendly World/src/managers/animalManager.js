const Animal = require('../models/Animal');

exports.create = (animalData) => Animal.create(animalData);

exports.getAll = () => Animal.find();

exports.getOne = (animalId) => Animal.findById(animalId);

exports.delete = (animalId) => Animal.findByIdAndDelete(animalId);

exports.edit = (animalId,animalData) => Animal.findByIdAndUpdate(animalId,animalData);

exports.search = async (search) => {

    const all = await Animal.find().lean();

    return all.filter(a => a.location.toLowerCase().includes(search.toLowerCase()));

}

exports.buy = async (animalId, userId) =>{
    const animal = await Animal.findById(animalId);

    animal.donations.push(userId);
    return animal.save();
}


exports.getThree = () => Animal.find({}).sort({_id:-1}).limit(3);




