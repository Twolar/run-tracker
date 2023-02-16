const express = require('express');
const {logger} = require('../../utility/logger');
const db = require('../../utility/database');
const CompletedRun = require('../models/completedRunModel');

const router = express.Router();

/**
 * @openapi
 * /completedRuns/:
 *   get:
 *     summary: Get all completed runs
 *     responses:
 *       200:
 *         description: Got all completed runs.
 */
router.get('/', (req, res) => {
    logger.info("GET REQUEST - CompletedRuns Fetch Initiated");

    var sql = "select * from completed_runs"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          logger.error(`GET REQUEST - CompletedRuns Fetch Failed: ${err}`);
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        });
        logger.info("GET REQUEST - CompletedRuns Fetched Succesfully");
      });
});

/**
 * @openapi
 * /completedRuns/{id}:
 *   get:
 *     summary: Get a single completed run
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the completed run to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Got a single completed run
 */
router.get("/:id", (req, res) => {
    logger.info("GET REQUEST - CompletedRun Fetch Initiated");

    var sql = "select * from completed_runs where id = ?"
    var params = [req.params.id]

    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          logger.error(`GET REQUEST - CompletedRun Fetched Failed: ${err}`);
          return;
        }
        res.json({
            "message":"success",
            "data":row
        });
        logger.info("GET REQUEST - CompletedRun Fetched Successfully");
      });
});

/**
 * @openapi
 * /completedRuns/create:
 *   post:
 *     summary: Add new completed run
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                dateCompleted:
 *                 type: string
 *                 description: Date of run
 *                 example: 'YYYY-MM-DD'
 *                distanceRan:
 *                 type: decimal
 *                 description: How far was the run in KMs
 *                 example: 5.5
 *                timeTaken:
 *                 type: decimal
 *                 description: How long the run took in minutes
 *                 example: 25
 *     responses:
 *       201:
 *         description: Added new completed run
 */
router.post('/create', (req, res) => {
    logger.info("POST REQUEST - CompletedRun Created Initiated");

    let errors = [];
    if (!req.body.dateCompleted){
        errors.push("No dateCompleted specified");
    }
    if (!req.body.distanceRan){
        errors.push("No distanceRan specified");
    }
    if (!req.body.timeTaken){
        errors.push("No timeTaken specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }

    let newRunCompleted = new CompletedRun(req.body.dateCompleted, req.body.distanceRan, req.body.timeTaken);

    var sql = 'INSERT INTO completed_runs (date, distance, time_taken) VALUES (?,?,?)';
    var params = [newRunCompleted.dateCompleted, newRunCompleted.distanceRan, newRunCompleted.timeTaken];

    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({"error": err.message})
            logger.error(`POST REQUEST - CompletedRun Created Failed: ${err}`);
            return;
        }
        res.json({
            "message": "success",
            "data": newRunCompleted,
            "id" : this.lastID
        });
        logger.info("POST REQUEST - CompletedRun Created Successfully");
    });
});

/**
 * @openapi
 * /completedRuns/{id}:
 *   patch:
 *     summary: Update existing completed run based on ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the completed run to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                dateCompleted:
 *                 type: string
 *                 description: Date of run
 *                 example: 'YYYY-MM-DD'
 *                distanceRan:
 *                 type: decimal
 *                 description: How far was the run in KMs
 *                 example: 5.5
 *                timeTaken:
 *                 type: decimal
 *                 description: How long the run took in minutes
 *                 example: 25
 *     responses:
 *       200:
 *         description: Updated existing run
 */
router.patch("/:id", (req, res) => {
    logger.info("PATCH REQUEST - CompletedRun Edit Initiated");

    let updatedRunCompleted = new CompletedRun(req.body.dateCompleted, req.body.distanceRan, req.body.timeTaken);
    
    db.run(
        `UPDATE completed_runs set 
           date = COALESCE(?,date), 
           distance = COALESCE(?,distance), 
           time_taken = COALESCE(?,time_taken) 
           WHERE id = ?`,
        [updatedRunCompleted.dateCompleted, updatedRunCompleted.distanceRan, updatedRunCompleted.timeTaken, req.params.id],
        function (err, result) {
            if (err) {
                res.status(400).json({"error": res.message})
                logger.error(`PATCH REQUEST - CompletedRun Edit Failed: ${err}`);
                return;
            }
            res.json({
                message: "success",
                data: updatedRunCompleted,
                changes: this.changes
            });
            logger.info("PATCH REQUEST - CompletedRun Edited Successfully");
    });
});

/**
 * @openapi
 * /completedRuns/{id}:
 *   delete:
 *     summary: Delete existing completed run based on ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the completed run to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted existing completed run based on ID
 */
router.delete("/:id", (req, res) => {
    logger.info("DELETE REQUEST - CompletedRun Delete Initiated");
    db.run(
        'DELETE FROM completed_runs WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                logger.error(`DELETE REQUEST - CompletedRun Delete Failed: ${err}`);
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
            logger.info("DELETE REQUEST - CompletedRun Deleted Successfully");
    });
})

//#region Other Methods

//#endregion

module.exports = router;
