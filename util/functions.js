const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const crypto = require('crypto')
const CronJob = require('cron').CronJob;
const {
    emit
} = require('../socket')

var saltRounds = 10;

const createHash = (password) => bcrypt.hashSync(password, saltRounds);
const compareHash = (password, hashedPassword) => bcrypt.compareSync(password, hashedPassword);

const jwtToken = ({
    user,
    // expire = 0
}) => {
    return new Promise((resolve, reject) => {
        jwt.sign({
                ...user
            }, process.env.JWT_SECRET_KEY,
            // {
            // expiresIn: expire
            // },
            (
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

var emailToken = (len) => crypto.randomBytes(len).toString('hex');

const scheduleProductExpiry = (product) => {
    return new Promise((resolve, reject) => {
        let date;

        switch (String(product.expire).length) {
            case 10:
                date = new Date(product.expire * 1000);
                break;
            case 13:
                date = new Date(product.expire);
                break;
            default:
                reject()
                break;
        }

        const job = new CronJob((new Date(date)), () => {
            emit('productExpired', product);
        });

        job.start();
        resolve()
    })
}

module.exports = {
    createHash,
    compareHash,
    jwtToken,
    emailToken,
    scheduleProductExpiry
}