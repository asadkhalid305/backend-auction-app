const bcrypt = require('bcrypt')

var saltRounds = 10;

const createHash = (password) => bcrypt.hashSync(password, saltRounds);
const compareHash = (password, hashedPassword) => bcrypt.compareSync(password, hashedPassword);

module.exports = {
    createHash,
    compareHash
}