const express = require('express');
const {logger} = require('../../utility/logger');
const db = require('../../utility/database');
const User = require('../models/userModel');
const bcrypt = require ('bcrypt'); // bcrypt

const saltRounds = 10; // data processing time

const router = express.Router();

/**
 * @openapi
 * /users/:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - users
 *     responses:
 *       200:
 *         description: Got all users.
 */
router.get('/', (req, res) => {
    logger.info("GET REQUEST - Users Fetch Initiated");

    var sql = "select * from users"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          logger.error(`GET REQUEST - Users Fetch Failed: ${err}`);
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        });
        logger.info("GET REQUEST - Users Fetched Succesfully");
      });
});

// /**
//  * @openapi
//  * /completedRuns/{id}:
//  *   get:
//  *     summary: Get a single completed run
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         description: Numeric ID of the completed run to retrieve.
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: Got a single completed run
//  */
// router.get("/:id", (req, res) => {
//     logger.info("GET REQUEST - CompletedRun Fetch Initiated");

//     var sql = "select * from completed_runs where id = ?"
//     var params = [req.params.id]

//     db.get(sql, params, (err, row) => {
//         if (err) {
//           res.status(400).json({"error":err.message});
//           logger.error(`GET REQUEST - CompletedRun Fetched Failed: ${err}`);
//           return;
//         }
//         res.json({
//             "message":"success",
//             "data":row
//         });
//         logger.info("GET REQUEST - CompletedRun Fetched Successfully");
//       });
// });

/**
 * @openapi
 * /users/create:
 *   post:
 *     summary: Add new user
 *     tags:
 *       - users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                email:
 *                 type: string
 *                 description: user email address
 *                 example: 'test@test.com'
 *                username:
 *                 type: string
 *                 description: username
 *                 example: ddot
 *                password:
 *                 type: string
 *                 description: user password
 *                 example: OwenWilsonWow
 *     responses:
 *       201:
 *         description: Added new user
 */
router.post('/create', (req, res) => {
    logger.info("POST REQUEST - User Created Initiated");

    let errors = [];
    if (!req.body.email){
        errors.push("No email specified");
    }
    if (!req.body.username){
        errors.push("No username specified");
    }
    if (!req.body.password){
        errors.push("No password specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }

    var sqlStatement = 'INSERT INTO users (email, username, password) VALUES (?,?,?)';
    
    // salt, hash, and store
    bcrypt.hash(req.body.password, saltRounds, function(err, hashedPassword) {
        let user = new User(req.body.email, req.body.username, hashedPassword);
        // store hash in database
        var params = [user.email, user.username, user.password];
        db.run(sqlStatement, params, function (err, result) {
            if (err) {
                res.status(400).json({"error": err.message})
                logger.error(`POST REQUEST - User Created Failed: ${err}`);
                return;
            }
            res.json({
                "message": "success",
                "data": { 
                    "email": user.email,
                    "username": user.username 
                },
                "id" : this.lastID
            });
            logger.info("POST REQUEST - User Created Successfully");
        });
    }); 
});

/**
 * @openapi
 * /users/login:
 *   post:
 *     summary: User login
 *     tags:
 *       - users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                username:
 *                 type: string
 *                 description: username
 *                 example: ddot
 *                password:
 *                 type: string
 *                 description: user password
 *                 example: OwenWilsonWow
 *     responses:
 *       201:
 *         description: User login
 */
router.post('/login', (req, res) => {
    logger.info("POST REQUEST - User Login Initiated");

    let errors = [];
    if (!req.body.username){
        errors.push("No username specified");
    }
    if (!req.body.password){
        errors.push("No password specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }

    var sqlStatement = 'SELECT password FROM users WHERE username = ?';
    
    db.get(sqlStatement, [req.body.username], function (dbError, dbRowResult) {
        if (dbError) {
            res.status(400).json({"error": dbError.message})
            logger.error(`POST REQUEST - User Login Failed: ${dbError}`);
            return;
        } else {
            var userHash = dbRowResult.password;
            // compare hash and password
            bcrypt.compare(req.body.password, userHash, function(compareError, compareResult) {
                if (compareError) {
                    res.status(401).json({"error": compareError.message})
                    logger.error(`POST REQUEST - User Login Failed: ${compareError}`);
                    return;
                } else {
                    res.json({
                        "message": "success",
                        "loginResult": compareResult,
                    });
                    logger.info("POST REQUEST - User Login Successfully");
                }
            });
        }
    });
});

// /**
//  * @openapi
//  * /completedRuns/{id}:
//  *   patch:
//  *     summary: Update existing completed run based on ID
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         description: Numeric ID of the completed run to update.
//  *         schema:
//  *           type: integer
//  *     requestBody:
//  *       required: false
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *                dateCompleted:
//  *                 type: string
//  *                 description: Date of run
//  *                 example: 'YYYY-MM-DD'
//  *                distanceRan:
//  *                 type: decimal
//  *                 description: How far was the run in KMs
//  *                 example: 5.5
//  *                timeTaken:
//  *                 type: decimal
//  *                 description: How long the run took in minutes
//  *                 example: 25
//  *     responses:
//  *       200:
//  *         description: Updated existing run
//  */
// router.patch("/:id", (req, res) => {
//     logger.info("PATCH REQUEST - CompletedRun Edit Initiated");

//     let updatedRunCompleted = new CompletedRun(req.body.dateCompleted, req.body.distanceRan, req.body.timeTaken);
    
//     db.run(
//         `UPDATE completed_runs set 
//            date = COALESCE(?,date), 
//            distance = COALESCE(?,distance), 
//            time_taken = COALESCE(?,time_taken) 
//            WHERE id = ?`,
//         [updatedRunCompleted.dateCompleted, updatedRunCompleted.distanceRan, updatedRunCompleted.timeTaken, req.params.id],
//         function (err, result) {
//             if (err) {
//                 res.status(400).json({"error": res.message})
//                 logger.error(`PATCH REQUEST - CompletedRun Edit Failed: ${err}`);
//                 return;
//             }
//             res.json({
//                 message: "success",
//                 data: updatedRunCompleted,
//                 changes: this.changes
//             });
//             logger.info("PATCH REQUEST - CompletedRun Edited Successfully");
//     });
// });

// /**
//  * @openapi
//  * /completedRuns/{id}:
//  *   delete:
//  *     summary: Delete existing completed run based on ID
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         description: Numeric ID of the completed run to delete.
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: Deleted existing completed run based on ID
//  */
// router.delete("/:id", (req, res) => {
//     logger.info("DELETE REQUEST - CompletedRun Delete Initiated");
//     db.run(
//         'DELETE FROM completed_runs WHERE id = ?',
//         req.params.id,
//         function (err, result) {
//             if (err){
//                 res.status(400).json({"error": res.message})
//                 logger.error(`DELETE REQUEST - CompletedRun Delete Failed: ${err}`);
//                 return;
//             }
//             res.json({"message":"deleted", changes: this.changes})
//             logger.info("DELETE REQUEST - CompletedRun Deleted Successfully");
//     });
// });

//#region Other Methods

//#endregion

module.exports = router;