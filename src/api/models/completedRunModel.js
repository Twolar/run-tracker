class CompletedRun {
    id;
    dateCompleted;
    distanceRan;
    timeTaken;

    constructor(dateCompleted, distanceRan, timeTaken) {
        this.dateCompleted = dateCompleted;
        this.distanceRan = distanceRan;
        this.timeTaken = timeTaken;
    }
}

module.exports = CompletedRun;