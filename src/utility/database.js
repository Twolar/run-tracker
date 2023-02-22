const {logger} = require('./logger');
const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      logger.error(err.message)
      throw err
    } else {
        logger.info('Connected to the SQLite database.');

        // Completed Runs Table
        db.run(`CREATE TABLE completed_runs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT, 
            distance REAL, 
            time_taken REAL 
            )`,
        (err) => {
            if (err) {
                logger.info('Table "completed_runs" already created');
            } else {
                // Table just created, creating an example row
                logger.info('Table "completed_runs" freshly created, creating an example row');
                var insert = 'INSERT INTO completed_runs (date, distance, time_taken) VALUES (?,?,?)';
                db.run(insert, ["2022-02-15", 6.08, 30]);
            }
        });
        // User Tables
        db.run(`CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT, 
            username TEXT, 
            password TEXT,
            token TEXT
            )`,
        (err) => {
            if (err) {
                logger.info('Table "users" already created');
            } else {
                // Table just created, creating an example row
                logger.info('Table "users" freshly created, creating an example row');
                var insert = 'INSERT INTO users (email, username, password, token) VALUES (?,?,?,?)';
                db.run(insert, ["test@test.com", "tbennett", "test1234", ""]);
            }
        });
    }
});

module.exports = db
