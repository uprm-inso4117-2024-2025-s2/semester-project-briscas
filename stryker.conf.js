// stryker.conf.js (project root)
module.exports = {
  mutator: "javascript",
  packageManager: "npm",
// decided on mocha over native since native was causing unintended behaviour 
  testRunner: "mocha",
	// assert our prerequired plugins 
  plugins: [
    "@stryker-mutator/core",
    "@stryker-mutator/javascript-mutator",
    "@stryker-mutator/mocha-runner"
  ],
  mochaOptions: {
	  spec: ["tests/legacy-tests.js"],
	  ignore: [
		  // ignore ai tests and performance tests ai is not vetted and performance does not fit in our model 
		  "tests/*AI*",
		  "tests/Performance*",
	  ]
  },
  reporters: ["progress", "clear-text", "html"],
  coverageAnalysis: "off",
  mutate: [
    "models/*.js",
// ignore tests and data files 
    "!models/**/*Test.js",
    "!models/card_values.js",
    "!models/Fuzzer.js"
  ],
// base threshold as it stands the code fails breaks in its totality 
  thresholds: {
    high: 85,
    low: 65,
    break: 50
  }
};

