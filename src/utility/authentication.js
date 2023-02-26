require('dotenv').config();
const {logger} = require('../utility/logger');
const db = require('../utility/database');
const bcrypt = require ('bcrypt');
const passport = require('passport');

var authUser = (username, password, done) => {
  logger.info("Local AUTHENTICATION - User Authentication Initialized");
  var sqlStatement = 'SELECT * FROM users WHERE username = ?';
  
  db.get(sqlStatement, [username], function (dbError, dbRowResult) {
      if (dbError) {
          logger.error(`Local AUTHENTICATION - User Authentication Failed: ${dbError}`);
          return done(null, false);
      } else {
          var userHash = dbRowResult.password;
          // compare hash and password
          bcrypt.compare(password, userHash, function(compareError, compareResult) {
              if (compareError) {
                  logger.error(`Local AUTHENTICATION - User Authentication Failed: ${compareError}`);
                  return done(null, false);
              } else {
                  let authenticated_user = { id: dbRowResult.id, username: dbRowResult.username }   
                  logger.info("Local AUTHENTICATION - User Authentication Successful");
                  return done(null, authenticated_user );
              }
          });
      }
  });
}

var jwtStrategy = (jwt_payload, done) => {
    logger.info("Jwt AUTHENTICATION - User Authentication Initialized");
    var sqlStatement = 'SELECT * FROM users WHERE token = ?';
    
    db.get(sqlStatement, [jwt_payload.sub], function (dbError, dbRowResult) {
        if (dbError) {
            logger.error(`Jwt AUTHENTICATION - User Authentication Failed: ${dbError}`);
            return done(dbError, false);
        } 
        if (dbRowResult) {
            let authenticated_user = { id: dbRowResult.id, username: dbRowResult.username }   
            logger.info("Local AUTHENTICATION - User Authentication Successful");
            return done(null, authenticated_user );
        } else {
            logger.error(`Jwt AUTHENTICATION - User Authentication Failed`);
            return done(null, false);
            // or you could create a new account
        }
    });
};

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
            "success": false
        });
    }
}

var localAuthenticate = passport.authenticate('local');
var jwtAuthenticate = passport.authenticate('jwt', { session: false });

module.exports = { jwtStrategy, authUser, checkAuthenticated, localAuthenticate, jwtAuthenticate }