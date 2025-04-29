// legacy test using mocha in order to orchestrate the tests for the purposes of mutation testing using 
// stryker to that this file only works in the context of the nodjs finite state machine operating in 
// game logic 
const fs = require('fs');
const path = require('path');

// Directory containing all legacy test files
const testDir = __dirname;

// Gather all *Test.js files, excluding AI and Performance tests
const legacyTests = fs.readdirSync(testDir)
  .filter((file) => file.endsWith('Test.js'))
// exclude AI not vetted yet 
  .filter((file) => !file.includes('AI'))          // exclude any file with 'AI' in its name
// exclude perfomance testing due to the scope and nature of mutation testing 
  .filter((file) => !file.startsWith('Performance')); // exclude 'PerformanceTest.js'

// ease of life for the purpose of runnign the tests the code itself should in the future be 
// wrapped individually this was a time and convinance decision could and should be overtitten in the 
// future 
// Wrap each legacy test in its own Mocha `it` block
describe('Legacy smoke-tests', function() {
  legacyTests.forEach((testFile) => {
    it(testFile, function() {
      // Requiring the file will execute its assertions/harness
      require(path.join(testDir, testFile));
    });
  });
});

