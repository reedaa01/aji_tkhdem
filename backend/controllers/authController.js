const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { email, password, full_name } = req.body;

    const exists = await UserModel.emailExists(email);
    if (exists) {
      return res.status(409).json({ success: false, message: 'Email already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await UserModel.create({ email, password: hashedPassword, full_name });

    const token = signToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: { id: user.uuid, email: user.email, full_name: user.full_name },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = signToken(user.id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: { id: user.uuid, email: user.email, full_name: user.full_name, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

module.exports = { register, login, getMe };
