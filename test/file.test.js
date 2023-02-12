const fs = require('fs');
const file = require('../src/file');

const testOutputFile = './output/testOutput.txt';

beforeEach(() => {
  fs.writeFileSync(testOutputFile, '', () => {});
});

test('Data is saved to file', () => {
  expect(file.addCompletedRun("Test data saved to file", testOutputFile)).toBe(true);
});

test('Data read from file', () => {
  var fileDataEntry = "Test data read from file";
  file.addCompletedRun(fileDataEntry, testOutputFile);

  expect(file.getCompletedRuns(testOutputFile).at(0)).not.toBe(false);
});