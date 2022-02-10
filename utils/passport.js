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
      // FIXME: This creates way more queries than needed:
      // Every protected req-res cycle has to query Users and
      // then Projects.
      User.findById(jwt_payload.id)
        .populate('ownProjects', { title: 1 })
        .populate('memberProjects', { title: 1 })
        .then((user) => {
          if (user) {
            console.log('passport query callback...');
            return done(null, user);
          }

          return done(null, false);
        })
        .catch((err) => done(err, false));
    })
  );
};
