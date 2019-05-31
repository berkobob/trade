const program = require("commander");

program
    .description("no change")
    .arguments("[ant...]")
    .action(cmd => {
        console.log("tought", cmd);
    });

// console.log(program);

program.parse(process.argv);
