const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  // .env থেকে JWT_SECRET ব্যবহার করা হচ্ছে
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d', // 7 দিনের জন্য টোকেন কার্যকর থাকবে
  });
};

module.exports = generateToken;