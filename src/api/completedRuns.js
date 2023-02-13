const express = require('express');
const completedRunsFile = require('../file');
const {logger} = require('../utility/logger');
const weather = require('../weather');

const router = express.Router();

// Get all completed runs
router.get('/', (req, res) => {
    let completedRunsArray = completedRunsFile.getCompletedRuns();
    res.json(completedRunsArray);
});

// Get single completed run based on ID

// Add new completed run
router.post('/addNew', (req, res) => {
    const runCompleted = {
        dateCompleted: req.body.dateCompleted,
        distanceRan: req.body.distanceRan,
        timeTaken: req.body.timeTaken,
    };
    
    generateOutputString(runCompleted)
    .then(outputString =>  {
        console.log("New run added:\n" + outputString);
        completedRunsFile.addCompletedRun(outputString);
    })
    .catch(error => logger.error(error));

    res.send('POST request to add new completed run');
});

// Update existing completed run based on ID

// Delete existing completed run based on ID

//#region Other Methods

function formatRunDetailsIntoString(runCompleted) {
    logger.info("Formatting run details into string");
    var runDetailsString = `Date: ${runCompleted.dateCompleted} | Distance Run: ${runCompleted.distanceRan}km | Time it took: ${runCompleted.timeTaken} minutes | Average Pace: ${Number(runCompleted.timeTaken/runCompleted.distanceRan).toFixed(2)} min/km`;
    return runDetailsString
}

async function generateOutputString(runCompleted) {
    logger.info("Generating output string");
    var weatherForSingleDay = await weather.fetchWeatherForSingleDate(runCompleted.dateCompleted);
    var outputString = formatRunDetailsIntoString(runCompleted) + " | " + weather.formatWeatherIntoString(weatherForSingleDay);
    return outputString;
}

//#endregion

module.exports = router;
