require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Job Portal API is running' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
};

start();
