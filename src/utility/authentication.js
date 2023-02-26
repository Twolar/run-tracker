require('dotenv').config();
const {logger} = require('../utility/logger');
const db = require('../utility/database');
const bcrypt = require ('bcrypt');
const passport = require('passport');

var authUser = (username, password, done) => {
  logger.info("AUTHENTICATION - User Authentication Initialized");
  var sqlStatement = 'SELECT * FROM users WHERE username = ?';
  
  db.get(sqlStatement, [username], function (dbError, dbRowResult) {
      if (dbError) {
          logger.error(`AUTHENTICATION - User Authentication Failed: ${dbError}`);
          return done(null, false);
      } else {
          var userHash = dbRowResult.password;
          // compare hash and password
          bcrypt.compare(password, userHash, function(compareError, compareResult) {
              if (compareError) {
                  logger.error(`AUTHENTICATION - User Authentication Failed: ${compareError}`);
                  return done(null, false);
              } else {
                  let authenticated_user = { id: dbRowResult.id, username: dbRowResult.username }   
                  logger.info("AUTHENTICATION - User Authentication Successfully");
                  return done(null, authenticated_user );
              }
          });
      }
  });
}

passport.serializeUser( (userObj, done) => {
  logger.info("SERIALIZE USER");
  done(null, userObj);
});

passport.deserializeUser((userObj, done) => {
  logger.info("DESERIALIZE USER");
  done (null, userObj )
});

var checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) { 
        return next() 
    } else {
        res.status(401).json({
            "message": "fail"
        });
    }
}

var authenticateMe = passport.authenticate('local');

module.exports = { authUser, checkAuthenticated, authenticateMe }