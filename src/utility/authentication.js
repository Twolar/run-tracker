//Search the user, password in the DB to authenticate the user
//Let's assume that a search within your DB returned the username and password match for "Kyle".   

// const { logger } = require("./logger");
// const passport = require('passport');

// //let authenticated_user = { id: 123, name: "Kyle"}   return done (null, authenticated_user )
// const authUser = (username, password, done) => {
//     logger.info("AUTHENTICATION - User Authentication Initialized");
//     var sqlStatement = 'SELECT * FROM users WHERE username = ?';
    
//     db.get(sqlStatement, [username], function (dbError, dbRowResult) {
//         if (dbError) {
//             logger.error(`AUTHENTICATION - User Authentication Failed: ${dbError}`);
//             return done(null, false);
//         } else {
//             var userHash = dbRowResult.password;
//             // compare hash and password
//             bcrypt.compare(password, userHash, function(compareError, compareResult) {
//                 if (compareError) {
//                     logger.error(`AUTHENTICATION - User Authentication Failed: ${compareError}`);
//                     return done(null, false);
//                 } else {
//                     let authenticated_user = { id: dbRowResult.id, username: dbRowResult.username }   
//                     logger.info("AUTHENTICATION - User Authentication Successfully");
//                     return done(null, authenticated_user );
//                 }
//             });
//         }
//     });
// }

// passport.serializeUser( (userObj, done) => {
//     logger.info("SERIALIZE USER");
//     done(null, userObj);
// });

// passport.deserializeUser((userObj, done) => {
//     logger.info("DESERIALIZE USER");
//     done (null, userObj )
// });

// const checkAuthenticated = (req, res, next) => {
//     logger.info("checkAuthenticated - Initialized");
//     if (req.isAuthenticated()) { 
//         logger.info("checkAuthenticated - User is authenticated");
//         return next();
//     } else {
//         logger.info("checkAuthenticated - User is not authenticated");
//         res.status(401).json({"error": err.message});
//         return;
//     }
//   }

// module.exports = [ authUser, checkAuthenticated ];