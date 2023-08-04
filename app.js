const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
const tooBusy = require('toobusy-js');

// Start express app
const app = express();

app.enable('trust proxy');

app.set('view engine', 'pug');

// Implement CORS
app.use(cors());
app.options('*', cors());

// Set security HTTP headers
app.use(helmet());
app.use(helmet.hsts());
app.use(helmet.frameguard());
app.use(helmet.noSniff());
app.use(helmet.hidePoweredBy());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/', limiter);

// Check if server is too busy
tooBusy.maxLag(100);
app.use((req, res, next) => {
  if (tooBusy()) {
    res.statusCode = 503;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Server too busy, try again later!');
  } else {
    next();
  }
});

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

app.use(compression());

app.all('*', (req, res, next) => {
  return res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

module.exports = app;
