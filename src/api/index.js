require('dotenv').config();
const express = require('express');
const completedRuns = require('./routes/completedRuns');
const users = require('./routes/users');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const authentication = require('../utility/authentication');

const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt ;

const router = express.Router();

router.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false ,
  saveUninitialized: true ,
}));
router.use(passport.initialize());
router.use(passport.session());
passport.use(new LocalStrategy (authentication.authUser))

var jwtOpts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_TOKEN_KEY
};
passport.use(new JWTStrategy(jwtOpts, authentication.jwtAuthUser));


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
