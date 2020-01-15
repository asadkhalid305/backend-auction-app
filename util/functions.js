const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const {
    JWT_SECRET_KEY
} = require('../util/variables');

var saltRounds = 10;

const createHash = (password) => bcrypt.hashSync(password, saltRounds);
const compareHash = (password, hashedPassword) => bcrypt.compareSync(password, hashedPassword);

const createToken = (user) => {
    return new Promise((resolve, reject) => {
        jwt.sign(user, JWT_SECRET_KEY, (
            err,
            token
        ) => {
            if (err)
                reject(err)
            else
                resolve(token)
        });
    })
}

module.exports = {
    createHash,
    compareHash,
    createToken
}