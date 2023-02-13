const yargs = require('yargs');
const weather = require('./src/weather');
const {logger} = require('./src/utility/logger');
const completedRunsFile = require('./src/file');

// Customize yargs version
yargs.version('1.1.0');

async function generateOutputString(runCompleted, date) {
    logger.info("Generating output string");
    var weatherForSingleDay = await weather.fetchWeatherForSingleDate(date);
    var outputString = formatRunDetailsIntoString(runCompleted) + " | " + weather.formatWeatherIntoString(weatherForSingleDay);
    return outputString;
}

function formatRunDetailsIntoString(runCompleted) {
    logger.info("Formatting run details into string");
    var runDetailsString = `Date: ${runCompleted.dateCompleted} | Distance Run: ${runCompleted.distanceRan}km | Time it took: ${runCompleted.timeTaken} minutes | Average Pace: ${runCompleted.averagePace} min/km`;
    return runDetailsString
}
   
// Create add command
yargs.command({
    command: 'runCompleted',
    describe: 'Calculates stats for a run completed based off time and distance',
    builder: {
        dateCompleted: {
            describe: 'Date of run completed in format YYYY-MM-DD',
            demandOption: true,  // Required
            type: 'string'     
        },
        distanceCompleted: {  
            describe: 'Distance ran',
            demandOption: true,
            type: 'number'
        },
        timeTaken: {  
            describe: 'How long the run took in minutes',
            demandOption: true,
            type: 'number'
        },
    },
  
    // Function for your command
    handler(argv) {
        const runCompleted = {
            distanceRan: argv.distanceCompleted,
            timeTaken: argv.timeTaken,
            averagePace: Number(argv.timeTaken/argv.distanceCompleted).toFixed(2),
            dateCompleted: argv.dateCompleted
        };

        generateOutputString(runCompleted, argv.dateCompleted)
        .then(outputString =>  {
        console.log("New run added:\n" + outputString);
        completedRunsFile.addCompletedRun(outputString);
        })
        .catch(error => logger.error(error));

        let completedRunsArray = completedRunsFile.getCompletedRuns();
        let completedRunsCount = completedRunsArray.filter(run => run).length;

        console.log(`${completedRunsCount} Completed runs in file: ${completedRunsArray.map( x => '\n' + x)}`);
    }
})

yargs.parse() // To set above changes