const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');

// @route   POST /api/admin/register
// @desc    Register a new admin (Public - MUST BE DISABLED AFTER FIRST USE)
exports.registerAdmin = async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
      return res.status(400).json({ message: 'Please enter username and password.' });
  }
  
  try {
    const adminExists = await Admin.findOne({ username });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Admin মডেল ব্যবহার করে নতুন ইউজার তৈরি ও পাসওয়ার্ড হ্যাশ করা
    const admin = await Admin.create({ username, password });

    if (admin) {
      res.status(201).json({
        _id: admin._id,
        username: admin.username,
        token: generateToken(admin._id), // টোকেন তৈরি
      });
    } else {
      res.status(400).json({ message: 'Invalid admin data' });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};


// @route   POST /api/admin/login
// @desc    Authenticate admin & get token
// @access  Public
exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const admin = await Admin.findOne({ username });

    // ইউজার আছে কিনা এবং পাসওয়ার্ড সঠিক কিনা তা যাচাই করা
    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        username: admin.username,
        token: generateToken(admin._id), // সফল লগইনের পর টোকেন পাঠানো
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};