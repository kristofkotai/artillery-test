//
// This script can evaluate the passCriteria in a test file against an artillery json report
//
// How to run:
//   $> node test-evaluator.js test.yml test.json
//
const fs = require('fs');
const util = require('util');
const yamljs = require('yamljs');
const _get = require('lodash.get');

logInfo('--------------');
logInfo('TEST EVALUATOR');
logInfo('--------------');

logInfo(`CLI Arguments: ${JSON.stringify(getCliArguments())}`);

logInfo('Loading report file...');
const reportFile = getReportFile();

logInfo('Loading test definition file...');
const passCriteria = getTestFile().passCriteria;

logInfo(`Evaluating ${Object.keys(passCriteria).length} pass criteria...`);
for (let key in passCriteria) {
  const criteriaJsonPath = key;
  const criteriaValue = passCriteria[key];
  const reportValue = _get(reportFile, criteriaJsonPath);

  logInfo(`Evaluating criteria: ${util.inspect(reportValue)} <-> ${util.inspect(criteriaValue)}`);
  if (!evaluateCriteria(reportValue, criteriaValue)) {
    logError(`Test criteria was not met! "${util.inspect(criteriaJsonPath)}" is "${util.inspect(reportValue)}" which is not "${util.inspect(criteriaValue)}".`);
  }
}
logInfo('Success! All test criteria was met!');

function getCliArguments() {
  const cliArguments = process.argv.slice(2);
  return {
    testFile: cliArguments[0],
    jsonReport: cliArguments[1]
  };
}

function getTestFile() {
  const testFilePath = getCliArguments().testFile;
  return yamljs.load(testFilePath);
}

function getReportFile() {
  const reportFilePath = getCliArguments().jsonReport;
  const reportFile = fs.readFileSync(reportFilePath, 'utf8');
  return JSON.parse(reportFile);
}

function evaluateCriteria (actualValue, criteria) {
  if (typeof criteria === 'object') {
    return evaluateComplexCriteria(actualValue, criteria);
  } else {
    return actualValue == criteria;
  }
}

function evaluateComplexCriteria (actualValue, criteria) {
  const criteriaType = Object.keys(criteria)[0];
  const criteriaValue = criteria[criteriaType];

  switch (criteriaType) {
    case 'lessThan':
      return actualValue < criteriaValue;
    case 'lessThanOrEqual':
      return actualValue <= criteriaValue;
    case 'greaterThan':
      return actualValue > criteriaValue;
    case 'greaterThanOrEqual':
      return actualValue >= criteriaValue;
    case 'isEmptyObject':
      return Object.keys(actualValue).length === 0;
    case 'isEmptyArray':
      return actualValue.length === 0;
    case 'isUndefined':
      return actualValue === undefined;
    default:
      logError(`ERROR: Unknown criteria type: "${criteriaType}".`);
  }
}

function logInfo (message) {
  console.log(`[INFO] ${message}`);
}

function logError (message) {
  console.error(`[ERROR] ${message}`);
  process.exit(1);
}
