const express = require('express');
const {logger} = require('../utility/logger');
const db = require('../database');

const router = express.Router();

// Get all completed runs
router.get('/', (req, res) => {
    var sql = "select * from completed_runs"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

// Get single completed run based on ID
router.get("/:id", (req, res) => {
    var sql = "select * from completed_runs where id = ?"
    var params = [req.params.id]

    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        });
      });
});

// Add new completed run
router.post('/create', (req, res) => {
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
            return;
        }
        res.json({
            "message": "success",
            "data": runCompleted,
            "id" : this.lastID
        });
    });
});

// Update existing completed run based on ID
router.patch("/:id", (req, res) => {
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
                return;
            }
            res.json({
                message: "success",
                data: runCompleted,
                changes: this.changes
            });
    });
});

// Delete existing completed run based on ID
router.delete("/:id", (req, res) => {
    db.run(
        'DELETE FROM completed_runs WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
})

//#region Other Methods

//#endregion

module.exports = router;
