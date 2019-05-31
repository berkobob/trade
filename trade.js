const program = require("commander");

program
    .command("load <filename>", "h")
    .command("get", "Get all trades or trades by symbol")
    .version("0.1.0", "-v, --version")
    .description("The command line interface for the trade log app")
    .parse(process.argv);
