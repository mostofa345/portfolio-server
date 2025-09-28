const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;

  // Header থেকে 'Bearer <token>' ফরম্যাটে টোকেন যাচাই করা
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // টোকেন ডিকোড করা (.env থেকে JWT_SECRET ব্যবহার করে)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ডাটাবেস থেকে অ্যাডমিনকে খুঁজে রিকোয়েস্টে যোগ করা
      req.admin = await Admin.findById(decoded.id).select('-password');

      next(); // পরের কন্ট্রোলারে যাওয়া
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, token failed or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };