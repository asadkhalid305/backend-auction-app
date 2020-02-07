const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const {
    ExtractJwt
} = require('passport-jwt');

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: process.env.JWT_SECRET_KEY
}, (payload, done) => {
    try {
        done(null, payload);
    } catch (error) {
        done(error, false);
    }
}));

// passport.use('reset', new JwtStrategy({
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
//     secretOrKey: process.env.JWT_SECRET_KEY
// }, (payload, done) => {
//     try {
//         done(null, payload);
//     } catch (error) {
//         done(error, false);
//     }
// }));