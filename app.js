const Http = require('http');
const Express = require('express');
const Router = Express.Router();
const BodyParser = require('body-parser');
const Mongoose = require('mongoose');
var cors = require('cors')
require('dotenv').config();

const Routes = require('./routes');
const Configurations = require('./configuration');

const application = Express();

application.use(BodyParser.json());

application.use(BodyParser.urlencoded({
    extended: false
}));

application.use(cors())

const server = Http.createServer(application);

const environment = process.env.NODE_ENV || 'development';

const port = process.env.PORT || 3011;

const mongodb = Configurations[environment];

Mongoose.connect(mongodb.url, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

const db = Mongoose.connection;

db.on('error', (err) => {
    console.error(`Error in connecting MongoDB:\n ${err}`);
});

db.on('connected', () => {
    console.log('MongoDB is up and running!');
    Routes(application, Router);
    server.listen(port, () => {
        console.log(`Server is up and running @${port}`);
    });
})