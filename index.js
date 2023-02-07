const yargs = require('yargs');
const fetch = require('node-fetch');


   
// Customize yargs version
yargs.version('1.1.0');

function fetchWeatherForSingleDate(date) {
    let queryUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Mt%20Eden%2C%20Auckland%2C%20New%20Zealand/${date}/${date}?unitGroup=metric&include=days%2Cobs&key=V6A8KLPTXBWXUDMZAGAUXPFJE&contentType=json`;
    
    return fetch(queryUrl)
        .then(response => response.json())
        .then(json => json.days[0]);    
}

function formatWeatherIntoString(weatherForSingleDay) {
    var weatherString = `Conditions: ${weatherForSingleDay.conditions} | Temperature: ${weatherForSingleDay.temp} degrees`;
    return weatherString
}

function formatRunDetailsIntoString(runCompleted) {
    var runDetailsString = `Distance Run: ${runCompleted.distanceRan}km | Time it took: ${runCompleted.timeTaken} minutes | Average Pace: ${runCompleted.averagePace} min/km`;
    return runDetailsString
}

function outputResult(runCompleted, date) {
    fetchWeatherForSingleDate(date)
    .then(weatherForSingleDay => 
        console.log(formatRunDetailsIntoString(runCompleted) + " | " + formatWeatherIntoString(weatherForSingleDay)));
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

        outputResult(runCompleted, argv.dateCompleted);
    }
})

yargs.parse() // To set above changes