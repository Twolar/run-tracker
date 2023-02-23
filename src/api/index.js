const express = require('express');
const {logger} = require('../utility/logger');
const completedRuns = require('./routes/completedRuns');
const users = require('./routes/users');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

require('dotenv').config();
const db = require('../utility/database');
const bcrypt = require ('bcrypt');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy

const router = express.Router();

router.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false ,
  saveUninitialized: true ,
}));
router.use(passport.initialize());
router.use(passport.session());

authUser = (username, password, done) => {
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
passport.use(new LocalStrategy (authUser))
passport.serializeUser( (userObj, done) => {
  logger.info("SERIALIZE USER");
  done(null, userObj);
});

passport.deserializeUser((userObj, done) => {
  logger.info("DESERIALIZE USER");
  done (null, userObj )
});

router.use('/completedRuns', completedRuns);
router.use('/users', users);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Taylor\'s Run Tracker API',
      version: '1.0.0',
    },
    servers: [
      {
        url: '/api/v1',
        description: 'Default',
      },
    ],
  },
  apis: [ // files containing swagger annotations as above
    './src/api/routes/completedRuns.js',
    './src/api/routes/users.js'
  ], 
};
const openapiSpecification = swaggerJsdoc(swaggerOptions);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

module.exports = router;
