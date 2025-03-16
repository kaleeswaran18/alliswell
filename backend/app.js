require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var http = require('http');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const cron = require('node-cron');
const axios = require('axios');
const socketIo = require('socket.io');

var indexRouter = require('./routes/index');  
var usersRouter = require('./routes/users');

require('./utills/dbconnection'); 

var app = express();
var server = http.createServer(app); 
var io = socketIo(server, { cors: { origin: '*' } }); 

// Make `io` available globally
app.set('socketio', io); 

// Middleware & Routes
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use('/', indexRouter);
app.use('/adminaccount', usersRouter);

// Catch 404 and error handling
app.use(function (req, res, next) {
  next(createError(404));
});
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// ✅ **Cron Job: Run Task at 12 AM Every Day**
const schedule = '0 0 * * *';  // Runs at 12 AM every day

const task = async () => {
    try {
        console.log("Running cron job at 12 AM...");
        const response = await axios.put('http://localhost:5000/adminaccount/todaycustomerupdate');
        
        // Broadcast update to all connected clients
        io.emit('dailyUpdate', { message: "Customer data updated!" });

        console.log("Cron job executed successfully:", response.data);
    } catch (error) {
        console.error("Error in cron job:", error.message);
    }
};

// Schedule the cron job
cron.schedule(schedule, task);
console.log('✅ Cron job scheduled to run at 12 AM.');

// Start server
const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`🚀 Server is Running at port ${port}`));

module.exports = { app, io };
