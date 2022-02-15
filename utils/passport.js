const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { SECRET } = require('./config');
const User = require('../models/User');

const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = SECRET;

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(options, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then((user) => {
          console.log('passport 1 User.findById query');
          if (user) {
            return done(null, user);
          }

          return done(null, false);
        })
        .catch((err) => done(err, false));
    })
  );
};
