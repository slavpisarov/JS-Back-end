const bcrypt = require('bcrypt');
const jwt = require('../lib/jwt');
const { SECRET } = require('../config/config');

const User = require('../models/User');

exports.login = async (email, password) =>{

    const user = await User.findOne({ email });

    if(!user){
        throw new Error('Invalid email or password')
    }

    const isValid = await bcrypt.compare(password,user.password);

    if(!isValid){
        throw new Error('Invalid user or password')
    }

    const token = await generateToken(user);

    return token;

}

exports.register = async (userData) => {
    const user = await User.findOne({email: userData.email});
    if(user){
        throw new Error('This email is already registered')
    }

    const createdUser = await User.create(userData);

    console.log(createdUser);

    const token = await generateToken(createdUser);

    return token;
}

async function generateToken(user) {
    const payload = {
        _id: user._id,
        username: user.username,
        email: user.email,
    };

    const token = await jwt.sign(payload, SECRET, { expiresIn: '2d'} );

    return token;
}
