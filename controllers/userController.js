const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');
const { SECRET } = require('../utils/config');

const getUsers = async (req, res) => {
  const queryObj = { ...req.query };

  let usersQuery = User.find({});

  if (queryObj.q) {
    usersQuery = User.find({
      $or: [{ username: queryObj.q }, { email: queryObj.q }],
    });
  }

  const users = await usersQuery.exec();

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
    const payload = { id: user.id, username: user.username, name: user.name };

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

const updateUser = async (req, res) => {
  const { userId } = req.params;
  const body = req.body;

  if (!req.user._id.equals(userId)) throw new AppError('Forbidden', 403);

  if (body.username) {
    const usernameExists = await User.findOne({ username: body.username });
    if (usernameExists) throw new AppError('Username already exists', 400);
  }

  if (body.email) {
    const emailExists = await User.findOne({ email: body.email });
    if (emailExists) throw new AppError('Email Already in Use', 400);
  }

  const user = await User.findById(userId).exec();

  if (!user) throw new AppError('User not found', 404);

  Object.keys(body).forEach((prop) => {
    user[prop] = body[prop];
  });

  const updatedUser = await user.save();

  res.json(updatedUser);
};

const sendInvite = async (req, res) => {
  const { userId } = req.params;
  const sender = req.user;
  const { project } = req.body;

  if (sender._id.equals(userId)) {
    throw new AppError('You cannot invite yourself', 400);
  }

  if (!sender.isProjectOwner(project)) {
    throw new AppError('Forbidden', 403);
  }

  const user = await User.findById(userId).exec();

  if (!user) throw new AppError('User not found', 404);

  if (user.isProjectOwner(project) || user.isProjectMember(project)) {
    throw new AppError('User is already a member of the project', 400);
  }

  if (user.invites.some((invite) => invite.project.equals(project))) {
    throw new AppError('An invite has already been sent to this user', 400);
  }

  user.invites.push({ project, sender });

  const invitedUser = await user.save();

  res.json(invitedUser);
};

module.exports = {
  getUsers,
  signupUser,
  loginUser,
  getCurrentUser,
  getUserById,
  updateUser,
  sendInvite,
};
