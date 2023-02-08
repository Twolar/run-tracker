const file = require('../src/file');

const testOutputFile = './output/testOutput.txt';

test('Data is saved to file', () => {
  expect(file.addCompletedRun("test", testOutputFile)).toBe(true);
});