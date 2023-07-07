const bcrypt = require('bcrypt');
const jwt = require('../lib/jwt');
const { SECRET } = require('../config/config');

const User = require('../models/User');

exports.login = async (username, password) =>{

    // if(username == '' || password == ''){
    //     throw new Error('Fill in all fields')
    // }

    const user = await User.findOne({ username });

    if(!user){
        throw new Error('Invalid user or password')
    }

    const isValid = await bcrypt.compare(password,user.password);

    if(!isValid){
        throw new Error('Invalid user or password')
    }

    const token = await generateToken(user);

    return token;

}

exports.register = async (userData) => {
    const user = await User.findOne({username: userData.username});
    if(user){
        throw new Error('Username already exists')
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
