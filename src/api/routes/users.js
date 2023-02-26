const express = require('express');
const {logger} = require('../../utility/logger');
const db = require('../../utility/database');
const User = require('../models/userModel');
const bcrypt = require ('bcrypt');
const passport = require('passport');
const authentication = require('../../utility/authentication');

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

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Get a single user
 *     tags:
 *       - users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Got a single user
 */
router.get("/:id", authentication.checkAuthenticated, (req, res) => {
    logger.info("GET REQUEST - User Fetch Initiated");

    var sql = "SELECT * FROM users where id = ?"
    var params = [req.params.id]

    db.get(sql, params, (err, dbResultRow) => {
        if (err) {
          res.status(400).json({"error":err.message});
          logger.error(`GET REQUEST - User Fetch Failed: ${err}`);
          return;
        }
        res.json({
            "message":"success",
            "data": dbResultRow
        });
        logger.info("GET REQUEST - User Fetched Successfully");
      });
});

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
router.post('/login', authentication.authenticateMe, (req, res) => { 
    res.json({
        "message": "success"
    });
});

/**
 * @openapi
 * /users/logout:
 *   delete:
 *     summary: User logout
 *     tags:
 *       - users
 *     responses:
 *       201:
 *         description: User logout
 */
router.delete('/logout', function (req, res){
    req.session.destroy(function (err) {
        res.json({
            "message": "success"
        });
    });
});

/**
 * @openapi
 * /users/{id}:
 *   patch:
 *     summary: Update existing user details based on ID
 *     tags:
 *       - users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user details to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
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
 *     responses:
 *       200:
 *         description: Updated existing run
 */
router.patch("/:id", (req, res) => {
    logger.info("PATCH REQUEST - User Edit Initiated");

    let updatedUser = new User(req.body.email, req.body.username, "");
    
    db.run(
        `UPDATE users set 
           email = COALESCE(?,email), 
           username = COALESCE(?,username) 
           WHERE id = ?`,
        [updatedUser.email, updatedUser.username, req.params.id],
        function (err, result) {
            if (err) {
                res.status(400).json({"error": res.message})
                logger.error(`PATCH REQUEST - User Edit Failed: ${err}`);
                return;
            }
            res.json({
                message: "success",
                data: {
                    "email": updatedUser.email,
                    "username": updatedUser.username
                },
                changes: this.changes
            });
            logger.info("PATCH REQUEST - User Edited Successfully");
    });
});

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Delete existing user based on ID
 *     tags:
 *       - users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted existing user based on ID
 */
router.delete("/:id", (req, res) => {
    logger.info("DELETE REQUEST - User Delete Initiated");
    db.run(
        'DELETE FROM users WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                logger.error(`DELETE REQUEST - User Delete Failed: ${err}`);
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
            logger.info("DELETE REQUEST - User Deleted Successfully");
    });
});

//#region Other Methods

//#endregion

module.exports = router;