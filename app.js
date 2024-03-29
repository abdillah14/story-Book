const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connectDB = require('./config/db')

//load config
dotenv.config({path:'./config/config.env' })

// passport config

require('./config/passport') (passport)

connectDB();

const app = express() 

//body parser
app.use(express.urlencoded({ extended: false}))
app.use(express.json())
//helpers
const {formatDate,stripTags,truncate, editIcon} = require('./helpers/hbs')

//handlebars
app.engine('.hbs', exphbs({ helpers : {
  formatDate,
  stripTags,
  truncate,
  editIcon,
}, defaultLayout: "main", extname: '.hbs'}));
app.set('view engine', '.hbs');
// session 
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI
  })

  }))

//passport middlewre
app.use(passport.initialize())
app.use(passport.session())
//set global  var
app.use((req, res, next)=>{
  res.locals.user = req.user  || null
  next()
})

//static folder
app.use(express.static(path.join(__dirname, "public")))

// routes

app.use('/', require('./route/index')) 
app.use('/auth', require('./route/auth'))
app.use('/stories', require('./route/stories')) 



const PORT = process.env.PORT || 3000
app.listen(PORT, console.log( `server running   on port ${PORT} `)
)