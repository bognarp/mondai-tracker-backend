const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { SECRET } = require('../utils/config');
const checkLogin = require('../validation/login');
const checkSignup = require('../validation/signup');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      next(err);
    });
};

const signupUser = (req, res, next) => {
  const { username, email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(400).json({ email: 'Email already exists' });
      }

      User.findOne({ username })
        .then((user) => {
          if (user) {
            return res.status(400).json({ username: 'Username already taken' });
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
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ user: 'User not found' });
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
          return res.status(400).json({ password: 'Incorrect password' });
        }
      });
    })
    .catch((err) => next(err));
};

const getCurrentUser = (req, res) => {
  res.json(req.user);
};

// Validations

const validateSignup = (req, res, next) => {
  const { errors, isValid } = checkSignup(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { errors, isValid } = checkLogin(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  next();
};

module.exports = {
  getUsers,
  signupUser,
  loginUser,
  getCurrentUser,
  validateSignup,
  validateLogin,
};
