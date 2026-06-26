const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const user = await User.create({ name, email, password, role });

  const token = generateToken(user._id);

  res.status(201).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile,
    },
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user._id);

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile,
    },
  });
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile,
    },
  });
};

exports.updateProfile = async (req, res) => {
  const { phone, skills, experience, education, company } = req.body;

  const updateData = {};
  if (phone !== undefined) updateData['profile.phone'] = phone;
  if (skills !== undefined) updateData['profile.skills'] = skills;
  if (experience !== undefined) updateData['profile.experience'] = experience;
  if (education !== undefined) updateData['profile.education'] = education;
  if (company !== undefined) updateData['profile.company'] = company;

  if (req.file) {
    updateData['profile.resume'] = req.file.path;
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile,
    },
  });
};
