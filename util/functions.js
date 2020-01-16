const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");

var saltRounds = 10;

const createHash = (password) => bcrypt.hashSync(password, saltRounds);
const compareHash = (password, hashedPassword) => bcrypt.compareSync(password, hashedPassword);

const createToken = ({
    user,
    expire = 0
}) => {
    return new Promise((resolve, reject) => {
        jwt.sign({
            ...user
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: expire
        }, (
            err,
            token
        ) => {
            if (err)
                reject(err);
            else {
                resolve(token);
            }
        })
    })
}

module.exports = {
    createHash,
    compareHash,
    createToken
}