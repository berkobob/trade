#!/usr/bin/env node

const program = require("commander");

program
    .command("cmd1 <x> [y]")
    .description("This is the first command")
    .option("-f, --file <name>", "filename")
    .option("-g, --gile", "gile")
    .action((x, y, cmd) => console.log(x, cmd.file, y, cmd.gile));

program
    .command("cmd2")
    .description("This is the second command")
    .option("-p, --peanut", "peanut")
    .action(cmd => console.log(cmd.peanut));

program.command("*").action(x => console.log(x));

program
    .version("0.1.0", "-v, --version")
    .description("The command line interface for the trade log app")
    .parse(process.argv);

if (process.argv.length < 3) program.help();
