console.clear();
//  npm packages
const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const colors = require('colors');
// Error Handler
const errorHandler = require('./middlewares/error');
// MongoDB connection config file
const connectDB = require('./config/db');
// Load env vars
dotenv.config({ path: './config/config.env' });
// Connect to DB
connectDB();
// Middleware files

// route files
const bootcampRoutes = require('./routes/bootcamps');
const courseRoutes = require('./routes/courses');

const app = express();
// Body Parse
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount Middlewares

// Mount Routers
app.use('/api/v1/bootcamps', bootcampRoutes);
app.use('/api/v1/courses', courseRoutes);

app.use(errorHandler);
// 404 PATH
app.use((req, res) => {
  console.log(req);
  res.status(404).json({
    pageTitle: 'Path Not Found',
    path: req.path,
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `App listening in ${process.env.NODE_ENV}  mode on port ${PORT}!`.yellow
      .bold
  );
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
