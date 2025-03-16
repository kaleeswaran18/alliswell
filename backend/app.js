var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const cron = require('node-cron');
const axios = require('axios')
var indexRouter = require('./routes/index');  
var usersRouter = require('./routes/users'); 
// const formData = require('express-form-data');
// var superAdminRouter = require('./routes/superAdmin');
//import file in db connection 
require('./utills/dbconnection') 
var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); 



app.use(cookieParser()); 
// app.use(express.static(path.join(__dirname, 'public/images')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
// app.use(formData.parse());

app.get('/start', (req, res) => {
  res.status(200).json({
    msg: 'hi--'
  })
})

app.use('/', indexRouter);
app.use('/adminaccount', usersRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// Define the cron schedule to run at 12 AM every day
const schedule = '* * * * *';

//for dev
// const schedule = '*/10 * * * * * '

// const schedule = '* * * * *';
// Define the task you want to run
const task = async () => { 
  var a = await axios.put('http://localhost:5000/adminaccount/todaycustomerupdate',

  )
  //  console.log(a,"message.toString()")
  // http://localhost:5000/adminaccount/todaycustomerupdate
  // console.log('This task is executed at 12 AM.');
  // Add your task logic here
}; 

// Schedule the task
cron.schedule(schedule, task); 

console.log('Cron job scheduled to run at 12 AM.');

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server is Running at port ${port}`))
   



module.exports = app; 
