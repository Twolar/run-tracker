const {logger} = require('./src/utility/logger');
const express = require('express');
const api = require('./src/api');
require('dotenv').config();

// const db = require('./src/utility/database');
// const bcrypt = require ('bcrypt');
// const passport = require('passport');
// const session = require('express-session');
// const LocalStrategy = require('passport-local').Strategy

const cors = require('cors');

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/v1', api);
app.use(
  express.urlencoded(),
  cors({
      origin: `http://localhost:${port}`
  })
);

// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false ,
//   saveUninitialized: true ,
// }));
// app.use(passport.initialize());
// app.use(passport.session());

// authUser = (username, password, done) => {
//   logger.info("AUTHENTICATION - User Authentication Initialized");
//   var sqlStatement = 'SELECT * FROM users WHERE username = ?';
  
//   db.get(sqlStatement, [username], function (dbError, dbRowResult) {
//       if (dbError) {
//           logger.error(`AUTHENTICATION - User Authentication Failed: ${dbError}`);
//           return done(null, false);
//       } else {
//           var userHash = dbRowResult.password;
//           // compare hash and password
//           bcrypt.compare(password, userHash, function(compareError, compareResult) {
//               if (compareError) {
//                   logger.error(`AUTHENTICATION - User Authentication Failed: ${compareError}`);
//                   return done(null, false);
//               } else {
//                   let authenticated_user = { id: dbRowResult.id, username: dbRowResult.username }   
//                   logger.info("AUTHENTICATION - User Authentication Successfully");
//                   return done(null, authenticated_user );
//               }
//           });
//       }
//   });
// }
// passport.use(new LocalStrategy (authUser))
// passport.serializeUser( (userObj, done) => {
//   logger.info("SERIALIZE USER");
//   done(null, userObj);
// });

// passport.deserializeUser((userObj, done) => {
//   logger.info("DESERIALIZE USER");
//   done (null, userObj )
// });

app.listen(port, () => {
  logger.info(`Listening: http://localhost:${port}`);
});

module.exports = app;