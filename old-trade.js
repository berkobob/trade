const program = require("commander");
const csv = require("csvtojson");
const table = require("table").table;
const chalk = require("chalk");

const load = require("./trade-upload");

const heading = chalk.bold;

/*
 ** The names of the fields in the database
 ** Create JSON using these values as keys
 ** and the csv as values to match was tradelog
 ** is expecting
 */

const headers = [
    "date",
    "buyOrSell",
    "quantity",
    "symbol",
    "expiry",
    "strike",
    "putOrCall",
    "tradePrice",
    "proceeds",
    "commission",
    "netCash",
    "assetClass",
    "openOrClose",
    "multiplier",
    "notes",
];

/*
 ** Column names to display raw csv data
 ** formatted as a row in an array so that each
 ** trade can be another row and then displayed
 ** as a table
 */
const data = [
    [
        heading("Date"),
        heading(""),
        heading("Qty"),
        heading("Symbol"),
        heading("Expiry"),
        heading("Strike"),
        heading(""),
        heading("Trade"),
        heading("Total"),
        heading("Comm"),
        heading("Net Cash"),
        heading(""),
        heading(""),
        heading("Mul"),
        heading("Notes"),
    ],
];

/*
 ** config to format the table that displays the raw csv
 */
const config = {
    columns: {
        0: { alignment: "center" }, // Date
        1: { alignment: "center" }, // Buy or Sell
        2: { alignment: "right" }, // Quantity
        3: { alignment: "left" }, // Symbol
        4: { alignment: "center" }, // Expiry
        5: { alignment: "right" }, // Strike
        6: { alignment: "center" }, // Put or Call
        7: { alignment: "right" }, // Trade price
        8: { alignment: "right" }, // Total amount
        9: { alignment: "right" }, // Commission
        10: { alignment: "right" }, // Net cash
        11: { alignment: "center" }, // Asset
        12: { alignment: "center" }, // Open or Close
        13: { alignment: "right" }, // Multiplier
        14: { alignment: "left" }, // Notes
    },
};

/*
 ** The load function
 */
program
    .command("load <filename>")
    .description("Load a CSV from IB to tradelog")
    .option("-n, --noheader", "CSV has no header row", false)
    .option("-y, --confirm", "I am happy to log these trades", false)
    .action((filename, cmd) =>
        csv({
            noheader: cmd.noheader,
            headers,
        })
            .fromFile(filename)
            .then(json => {
                if (cmd.confirm) load(json);
                else {
                    json.forEach(trade => data.push(Object.values(trade)));
                    console.log(table(data, config));
                    console.log(
                        chalk.yellow.inverse.bold("RESULT:"),
                        `There are ${data.length - 1} trades in ${filename}`,
                    );
                }
            })
            .catch(e =>
                console.log(
                    error("ERROR:"),
                    "File",
                    chalk.bold(filename),
                    "not found",
                ),
            ),
    );

/*
 ** The get trade(s) function
 */
program
    .command("get [symbol]")
    .description("Get all trades or all trades for a sumbol")
    .option("-s, --sum", "Calculate profit for closed trades")
    .option("-c, --closed", "Only get closed trades")
    .option("-o, --open", "Only get open trades")
    .action((symbol, cmd) => {
        console.log(symbol);
        console.log(cmd.sum);
    });

program
    .version("0.1.0", "-v, --version")
    .description("The command line version of the trade log app")
    // .command("help", "Use trade with a command option", { isDefault: true })
    .parse(process.argv);
