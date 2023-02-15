const express = require('express');
const {logger} = require('../utility/logger');
const db = require('../database');

const router = express.Router();

// Get all completed runs
router.get('/', (req, res) => {
    logger.info("CompletedRun GET ALL REQUEST INITIATED");

    var sql = "select * from completed_runs"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          logger.error(`CompletedRun GET ALL REQUEST FAILED: ${err}`);
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        });
        logger.info("CompletedRun GET ALL REQUEST SUCCESFUL");
      });
});

// Get single completed run based on ID
router.get("/:id", (req, res) => {
    logger.info("CompletedRun GET SINGLE REQUEST INITIATED");

    var sql = "select * from completed_runs where id = ?"
    var params = [req.params.id]

    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          logger.error(`CompletedRun GET SINGLE REQUEST FAILED: ${err}`);
          return;
        }
        res.json({
            "message":"success",
            "data":row
        });
        logger.info("CompletedRun GET SINGLE REQUEST SUCCESFUL");
      });
});

// Add new completed run
router.post('/create', (req, res) => {
    logger.info("CompletedRun POST REQUEST INITIATED");

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

    const runCompleted = {
        dateCompleted: req.body.dateCompleted,
        distanceRan: req.body.distanceRan,
        timeTaken: req.body.timeTaken
    };

    var sql = 'INSERT INTO completed_runs (date, distance, time_taken) VALUES (?,?,?)';
    var params = [runCompleted.dateCompleted, runCompleted.distanceRan, runCompleted.timeTaken];

    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({"error": err.message})
            logger.error(`CompletedRun POST REQUEST FAILED: ${err}`);
            return;
        }
        res.json({
            "message": "success",
            "data": runCompleted,
            "id" : this.lastID
        });
        logger.info("CompletedRun POST REQUEST SUCCESFUL");
    });
});

// Update existing completed run based on ID
router.patch("/:id", (req, res) => {
    logger.info("CompletedRun PATCH REQUEST INITIATED");

    const runCompleted = {
        dateCompleted: req.body.date,
        distanceRan: req.body.distance,
        timeTaken: req.body.time_taken
    };
    db.run(
        `UPDATE completed_runs set 
           date = COALESCE(?,date), 
           distance = COALESCE(?,distance), 
           time_taken = COALESCE(?,time_taken) 
           WHERE id = ?`,
        [runCompleted.dateCompleted, runCompleted.distanceRan, runCompleted.timeTaken, req.params.id],
        function (err, result) {
            if (err) {
                res.status(400).json({"error": res.message})
                logger.error(`CompletedRun PATCH REQUEST FAILED: ${err}`);
                return;
            }
            res.json({
                message: "success",
                data: runCompleted,
                changes: this.changes
            });
            logger.info("CompletedRun PATCH REQUEST SUCCESFUL");
    });
});

// Delete existing completed run based on ID
router.delete("/:id", (req, res) => {
    logger.info("CompletedRun DELETE REQUEST INITIATED");
    db.run(
        'DELETE FROM completed_runs WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                logger.error(`CompletedRun DELETE REQUEST FAILED: ${err}`);
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
            logger.info("CompletedRun DELETE REQUEST SUCCESFUL");
    });
})

//#region Other Methods

//#endregion

module.exports = router;
