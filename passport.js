const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const {
    ExtractJwt
} = require('passport-jwt');
const {
    JWT_SECRET_KEY
} = require('./util/variables');

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: JWT_SECRET_KEY
}, (payload, done) => {
    try {
        done(null, payload);
    } catch (error) {
        done(error, false);
    }
}));