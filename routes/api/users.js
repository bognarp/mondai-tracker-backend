const bcrypt = require('bcryptjs');
const express = require('express');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const validateLoginInput = require('../../validation/login');
const validateSignupInput = require('../../validation/signup');
const { SECRET } = require('../../utils/config');
const passport = require('passport');
const router = express.Router();

// /api/users

router.get('/', (req, res, next) => {
  User.find({})
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/signup', (req, res, next) => {
  const { errors, isValid } = validateSignupInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { username, email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        errors.email = 'Email already exists';
        return res.status(400).json(errors);
      }

      User.findOne({ username })
        .then((user) => {
          if (user) {
            errors.username = 'Username already taken';
            return res.status(400).json(errors);
          }
          const newUser = new User({
            username,
            email,
            password,
          });

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then((user) => res.json(user))
                .catch((err) => console.log(err));
            });
          });
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

router.post('/login', (req, res, next) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          const payload = { id: user.id, username: user.username };

          jwt.sign(
            payload,
            SECRET,
            { expiresIn: 3600 },
            (err, encodedToken) => {
              res.json({ success: true, token: `${encodedToken}` });
            }
          );
        } else {
          errors.password = 'Incorrect password';
          return res.status(400).json(errors);
        }
      });
    })
    .catch((err) => next(err));
});

// Protected routes

router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

module.exports = router;
