const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true // createdAt and updatedAt fields
});

// Pre-save hook: পাসওয়ার্ড সেভ করার আগে হ্যাশ করা
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  // 10 রাউন্ড সল্ট তৈরি করে পাসওয়ার্ড হ্যাশ করা
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method: লগইন করার সময় হ্যাশ করা পাসওয়ার্ডের সাথে ইনপুট পাসওয়ার্ডের তুলনা করা
adminSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;