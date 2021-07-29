import fs from 'fs';
// Import tests
import test_lexer from './tests/test_lexer';
import test_parser from './tests/test_parser';
// Tests to run
const tests = [
  test_lexer,
  test_parser
];
// Run tests
const output: Map<string, string>  = new Map();
tests.forEach((test) => {
  console.log(`[\x1b[33mRunning\x1b[0m]: ${test.name}`);
  // Run the test
  const results = test.run();
  output.set(test.name, results);
});
let comparison: Map<string, string>;
if (fs.existsSync('./expected.json')) {
  const comparisonRaw = JSON.parse(fs.readFileSync('./expected.json', 'utf8'));
  comparison = new Map(comparisonRaw);
} else fs.writeFileSync('./expected.json', JSON.stringify([...output]));
// Compare
interface TableBody {
  pass: string;
  name: string;
  description: string;
}
const tableBody: TableBody[] = [];
const passes: boolean[] = [];
tests.forEach((test) => {
  const pass: boolean = !comparison.has(test.name) ? true : comparison.get(test.name) == output.get(test.name);
  // make table
  tableBody.push({
    pass: pass ? '✅ Passed' : '🟥 Failed',
    name: test.name,
    description: test.description
  });
  // Push to passes count
  passes.push(pass);
});
console.table(tableBody);
if (passes.every((val) => val)) {
  fs.writeFileSync('./expected.json', JSON.stringify([...output]));
}