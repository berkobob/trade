const program = require("commander");
const csv = require("csvtojson");
const table = require("table").table;
const chalk = require("chalk");

const upload = require("./upload");
const { colour } = require("./utils");

program
    .description("Load a CSV exported from IB to trade log")
    .option("-n --noheader", "CSV has no header row", false)
    .option("-y --confirm", "I am happy to log these trades", false)
    .parse(process.argv);

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
        colour.heading("Date"),
        colour.heading(""),
        colour.heading("Qty"),
        colour.heading("Symbol"),
        colour.heading("Expiry"),
        colour.heading("Strike"),
        colour.heading(""),
        colour.heading("Trade"),
        colour.heading("Total"),
        colour.heading("Comm"),
        colour.heading("Net Cash"),
        colour.heading(""),
        colour.heading(""),
        colour.heading("Mul"),
        colour.heading("Notes"),
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
if (program.args.length === 0)
    return colour.error("Enter file name to be loaded");
if (program.args.length > 1)
    return colour.error("Only one file at a time please.");

const filename = program.args[0];

csv({
    noheader: program.noheader,
    headers,
})
    .fromFile(filename)
    .then(json => {
        if (program.confirm) upload(json);
        else {
            json.forEach(trade => data.push(Object.values(trade)));
            console.log(table(data, config));
            console.log(
                colour.success(
                    `There are ${data.length - 1} trades in ${filename}`,
                ),
            );
        }
    })
    .catch(e => colour.error('File "' + chalk.bold(filename) + '" not found'));
