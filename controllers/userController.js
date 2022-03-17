const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');
const { SECRET } = require('../utils/config');

const getUsers = async (req, res) => {
  const users = await User.find({}).exec();
  res.json(users);
};

const signupUser = async (req, res) => {
  const { username, email, password } = req.body;

  const userByEmail = await User.findOne({ email }).exec();
  if (userByEmail) {
    throw new AppError(`Email '${email}' already exists`, 400);
  }

  const userByUsername = await User.findOne({ username }).exec();
  if (userByUsername) {
    throw new AppError(`Username '${username}' already taken`, 400);
  }

  const newUser = new User({
    username,
    email,
    password,
  });

  const salt = await bcrypt.genSalt(10);
  const hashedPw = await bcrypt.hash(newUser.password, salt);

  newUser.password = hashedPw;

  await newUser.save();

  res.json(newUser);
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).exec();
  if (!user) {
    throw new AppError(`User with email '${email}' not found`, 400);
  }

  const match = await bcrypt.compare(password, user.password);

  if (match) {
    const payload = { id: user.id, username: user.username };

    jwt.sign(payload, SECRET, { expiresIn: '2h' }, (err, encodedToken) => {
      res.json({ success: true, token: `${encodedToken}` });
    });
  } else {
    throw new AppError('Incorrect password', 400);
  }
};

const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('ownProjects', { title: 1 })
    .populate('memberProjects', { title: 1 })
    .exec();

  res.json(user);
};

const getUserById = async (req, res) => {
  const user = await User.findById(req.params.userId).exec();
  res.json(user);
};

module.exports = {
  getUsers,
  signupUser,
  loginUser,
  getCurrentUser,
  getUserById,
};
