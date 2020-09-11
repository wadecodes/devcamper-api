console.clear();
// core packages
const path = require('path');
//  npm packages
const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
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
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const reviewRoutes = require('./routes/reviews');

const app = express();
// Body Parse
app.use(express.json());
//Cookie parser

// Dev logging middleware
app.use(cookieParser());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//FIle uploading
app.use(fileupload());

// Sanitize the data
app.use(mongoSanitize());
//set security header
app.use(helmet());
// prevent cross site scripting
app.use(xss());
// Rate Limitng 10 mins
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});
app.use(limiter);
//prevent http param pollution
app.use(hpp());
//enable cors
app.use(cors());
//set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount Middlewares

// Mount Routers
app.use('/api/v1/bootcamps', bootcampRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/reviews', reviewRoutes);

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
