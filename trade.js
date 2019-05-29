#!/usr/bin/env node

const program = require("commander");
const csv = require("csvtojson");
const chalk = require("chalk");
const table = require("table").table;
const request = require("request");

const cols = [
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

const rows = [
    [
        "Date",
        "",
        "Qty",
        "Symbol",
        "Expiry",
        "Strike",
        "",
        "Trade",
        "Total",
        "Comm",
        "Net Cash",
        "",
        "",
        "Mul",
        "Notes",
    ],
];

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

const error = chalk.red.inverse.bold;
const success = chalk.green.inverse.bold;
const url = "https://mytradelog.herokuapp.com/api";
const headers = { "content-type": "application/json" };

const load = (json, confirm) => {
    if (confirm) {
        json.forEach(trade => {
            // if (trade.putOrCall === "") trade.putOrCall = "P";
            if (trade.putOrCall === "") delete trade.putOrCall;

            request(
                {
                    url,
                    method: "POST",
                    headers,
                    json: trade,
                },
                (err, res, body) => {
                    if (err) console.log(err);
                    // if (res) console.log("RESULT", res.statusCode);
                    if (res) {
                        console.log("RESULT", res.statusMessage);
                        rows.push(Object.values(trade));
                    }
                    // if (body) console.log("BODY", body);
                },
            );
        });
    } else {
        json.forEach(trade => rows.push(Object.values(trade)));
    }

    // console.log(table(rows, config));
};

/*
 ** The load function
 */
program
    .command("load <filename>")
    .description("Load a CSV from IB to tradelog")
    .option("-n --noheader", "CSV has no header row", false)
    .option("-y --confirm", "I am happy to log these trades", false)
    .action(
        (filename, cmd) =>
            csv({
                noheader: cmd.noheader,
                headers: cols,
            })
                .fromFile(filename)
                .then(json => load(json, cmd.confirm))
                .catch(e =>
                    console.log(
                        error("ERROR:"),
                        "File",
                        chalk.bold(filename),
                        "not found",
                    ),
                ),
        // load(filename, cmd.noheader).then(res => console.log(res.length)),
    );

program
    .version("0.1.0", "-v, --version")
    .description("The command line version of the trade log app")
    .parse(process.argv);
