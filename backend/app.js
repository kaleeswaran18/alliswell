const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const cron = require('node-cron');
const axios = require('axios');
const http = require('http'); 
const { initializeSocket } = require('./socket');

require('./utills/dbconnection'); // Import database connection

const app = express();
const server = http.createServer(app); 
const io = initializeSocket(server); // Initialize socket.io

// Attach Socket.IO instance to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middleware
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Static Files
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Routes
app.use('/', require('./routes/index'));
app.use('/adminaccount', require('./routes/users'));

// Basic API Route
app.get('/start', (req, res) => {
  res.status(200).json({ msg: 'hi' });
});

// Error Handling
app.use((req, res, next) => next(createError(404)));
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500).render('error');
});

// Cron Job (Runs Every Minute for Testing)
const schedule = '* * * * *';
const task = async () => {
  try {
    await axios.put('http://localhost:5000/adminaccount/todaycustomerupdate');
    console.log('Cron job executed.');
  } catch (error) {
    console.error('Cron job error:', error.message);
  }
};
cron.schedule(schedule, task);

console.log('Cron job scheduled.');

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
