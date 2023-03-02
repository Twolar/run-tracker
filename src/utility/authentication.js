require('dotenv').config();
const {logger} = require('../utility/logger');
const db = require('../utility/database');
const bcrypt = require ('bcrypt');
const passport = require('passport');

const jwt = require('jsonwebtoken');

var verifyUserLogin = (username, password) => {
    return new Promise( (resolve, reject) => {
        var sqlStatement = 'SELECT * FROM users WHERE username = ?';
        db.get(sqlStatement, [username], function (dbError, dbRowResult) {
            if (dbError) {
                logger.error(`verifyUserLogin - DB Get User Failed: ${dbError}`);
                resolve(false);
            } else {
                logger.info("verifyUserLogin - DB Get User Successful");
                var userHash = dbRowResult.password;
                // compare hash and password
                bcrypt.compare(password, userHash, function(compareError, compareResult) {
                    if (compareError) {
                        logger.error(`verifyUserLogin - User Authentication Failed: ${compareError}`);
                        resolve(false);
                    }
                    if (compareResult) {
                        logger.info(`verifyUserLogin - User Authentication Successful with CompareResult = ${compareResult}`);
                        resolve(dbRowResult);
                    } else {
                        logger.error(`verifyUserLogin - User Authentication Failed with CompareResult = ${compareResult}`);
                        resolve(false);
                    }
                });
            }
        });
    });
}

var authUser = (username, password, done) => {
    logger.info("authUser AUTHENTICATION - User Authentication Initialized");
    verifyUserLogin(username, password)
        .then((user) => {
            if (user) {
                let authenticated_user = { id: user.id, username: user.username }   
                logger.info(`authUser AUTHENTICATION - User Authentication Successfully for userId ${user.id}`);
                return done(null, authenticated_user );
            } else {
                logger.error(`authUser AUTHENTICATION - User Authentication Failed`);
                return done(null, false);
            }
        }
    );
}

var jwtAuthUser = (jwtPayload, done) => {
    logger.info("Jwt AUTHENTICATION - Initiated");
    var user = db.FindUserById(jwtPayload.sub);
    logger.info(`Jwt AUTHENTICATION - jwtPayload.sub is ${jwtPayload.sub}`);
    if (user) {
        logger.info("Jwt AUTHENTICATION - Successful");
        return done(null, user);
    } else {
        logger.info("Jwt AUTHENTICATION - Failed");
        return done(null, false);
    }
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

var genToken = (user) => {
    logger.info(`genToken - Generating token for userId = ${user.id}`);
    var token = jwt.sign({
      iss: 'Taylor-Run-Tracker',
      sub: user.id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1)
    }, process.env.JWT_TOKEN_KEY);

    logger.info(`genToken - token for userId ${user.id} is ${token}`);
    return token;
};

var localAuthenticate = passport.authenticate('local');
var jwtAuthenticate = passport.authenticate('jwt', { session: false });

module.exports = { verifyUserLogin, authUser, checkAuthenticated, localAuthenticate, jwtAuthUser, genToken, jwtAuthenticate }