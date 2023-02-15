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
        db.run(`CREATE TABLE completed_runs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT, 
            distance REAL, 
            time_taken REAL 
            )`,
        (err) => {
            if (err) {
                logger.info('Table already created');
            } else {
                // Table just created, creating some rows
                logger.info('Table freshly created, creating some example row');
                var insert = 'INSERT INTO completed_runs (date, distance, time_taken) VALUES (?,?,?)'
                db.run(insert, ["2022-02-15", 6.08, 30])
            }
        });  
    }
});

module.exports = db
