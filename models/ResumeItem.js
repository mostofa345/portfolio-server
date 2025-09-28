// models/ResumeItem.js
const mongoose = require('mongoose');

const resumeItemSchema = new mongoose.Schema({
    // অভিজ্ঞতা, শিক্ষা, দক্ষতা, বা আমার সম্পর্কে (experience, education, skills, about)
    category: {
        type: String,
        required: true,
        enum: ['experience', 'education', 'skills', 'about'] 
    },
    // পদবী/কোর্সের নাম/দক্ষতার নাম
    title: {
        type: String,
        required: true,
    },
    // প্রতিষ্ঠানের নাম/কোম্পানির নাম (ঐচ্ছিক)
    company: {
        type: String,
        required: function() { return this.category === 'experience'; } // শুধুমাত্র 'experience' এর জন্য বাধ্যতামূলক
    },
    institution: {
        type: String,
        required: function() { return this.category === 'education'; } // শুধুমাত্র 'education' এর জন্য বাধ্যতামূলক
    },
    // সময়কাল
    year: {
        type: String,
        required: function() { 
            return this.category === 'experience' || this.category === 'education'; 
        } 
    },
    // বিস্তারিত বিবরণ
    description: {
        type: String,
        required: true,
    },
    // দক্ষতার জন্য আইকন কোড (যেমন: FaReact, SiMongodb)
    icon: {
        type: String,
        required: function() { return this.category === 'skills'; } // শুধুমাত্র 'skills' এর জন্য বাধ্যতামূলক
    },
    // sorting এর জন্য
    order: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const ResumeItem = mongoose.model('ResumeItem', resumeItemSchema);

module.exports = ResumeItem;