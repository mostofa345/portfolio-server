const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const resumeRoutes = require('./routes/resumeRoutes'); 
const footerRoutes = require('./routes/footer.route');
const blogRoutes = require('./routes/blogRoutes');
const commentRoutes = require('./routes/commentRoutes');
const messageRoutes = require('./routes/messageRoutes');

const projectRoutes = require('./routes/projectRoutes');
const projectNavRoutes = require("./routes/projectNavRoutes"); 
const webNavRoutes = require("./routes/webNavRoutes");
const serviceRoutes = require('./routes/service.routes');
const reviewRoutes  = require('./routes/reviewRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const adminRoutes = require('./routes/adminRoutes'); 

app.use('/api/resume', resumeRoutes);
app.use("/api/webnav", webNavRoutes);
app.use('/api/projects', projectRoutes);
app.use("/api/projectnav", projectNavRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/reviews', reviewRoutes); 
app.use('/api/portfolio', portfolioRoutes); // এই লাইনটি যোগ করুন
app.use('/api/footer', footerRoutes); 
app.use('/api/blogs', blogRoutes); // All blog routes start with /api/blogs
app.use('/api/blogs', blogRoutes);
app.use('/api/messages', messageRoutes); // Base route setup
app.use('/api/admin', adminRoutes);


// 404 handler → If no route matches
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "API endpoint not found" });
});

// Global error handler → For all errors
app.use((err, req, res, next) => {
  console.error("Error stack:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message
  });
});

// Database connection
const port = process.env.PORT || 5000;
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Database connected');
  app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
})
.catch((err) => console.error('DB connection error:', err));
