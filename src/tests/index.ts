import fs from 'fs';
// Import tests
import test_lexer_pass from './Suite/Tests/Lexer-Pass';
import test_lexer_fail from './Suite/Tests/Lexer-Fail';
import test_parser_pass from './Suite/Tests/Parser-Pass';
import test_parser_fail from './Suite/Tests/Parser-Fail';
// Tests to run
const tests = [
  test_lexer_pass,
  test_lexer_fail,
  test_parser_pass,
  test_parser_fail
];
// Compare
interface TableBody {
  pass: string;
  name: string;
  description: string;
}
const tableBody: TableBody[] = [];
tests.forEach((test) => {
  console.log(`[\x1b[33mLoading\x1b[0m]: ${test.name}`);
  // Load Test Data
  const testData = fs.existsSync(`./Tests/${test.name}.json`) ? fs.readFileSync(`./Tests/${test.name}.json`, 'utf8') : '{}';
  let t;
  try {
    t = JSON.parse(testData);
  } catch(err) {
    t = { data: '' };
  }
  process.stdout.moveCursor(0, -1);
  process.stdout.clearLine(1);
  console.log(`[\x1b[33mRunning\x1b[0m]: ${test.name}`);
  // Run Tests
  const results = test.run();
  tableBody.push({
    pass: t.data == results ? '✅ Passed' : '🟥 Failed',
    name: test.name,
    description: test.description
  });
  if (!fs.existsSync(`./Tests/${test.name}.json`) || t.data == '')
    fs.writeFileSync(`./Tests/${test.name}.json`, JSON.stringify({ data: results }));
  process.stdout.moveCursor(0, -1);
  process.stdout.clearLine(1);
  console.log(`[\x1b[33mCompleted\x1b[0m]: ${test.name}`);
});
console.table(tableBody);