const program = require("commander");

program.option("-x").option("-c");

program.parse(process.argv);

console.log(program);

console.log(program.args);
