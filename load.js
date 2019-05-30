const createStream = require("table").createStream;
const chalk = require("chalk");
const request = require("request");
const numeral = require("numeral");

const { formatRow } = require("./utils");

const heading = chalk.bold.inverse.blue;
const error = chalk.red.inverse.bold;
const success = chalk.green.inverse.bold;
// const url = "https://mytradelog.herokuapp.com/api";
const url = "http://localhost:3000/api";
// const url = "error";

/*
 ** The column headings for the results table
 */
const header = [
    heading("          ID         "),
    heading(" Date "),
    heading(""),
    heading("Qty"),
    heading("Symbol"),
    heading("  Expiry  "),
    heading("Strike"),
    heading(""),
    heading(" Trade "),
    heading(" Total "),
    heading(" Comm "),
    heading(" Net Cash "),
    heading(""),
    heading(""),
    heading("Mul"),
    heading(" Notes  "),
    heading("RESULT "),
];

/*
 ** Configure the table columns of the results table
 ** and the stream to populate the table
 */
const stream = createStream({
    columnDefault: {
        width: 1,
    },
    columnCount: 17,
    columns: {
        0: { alignment: "center", width: 24 }, // ID
        1: { alignment: "center", width: 13 }, // Date
        2: { alignment: "center", width: 4 }, // Buy or Sell
        3: { alignment: "right", width: 4 }, // Quantity
        4: { alignment: "left", width: 6 }, // Symbol
        5: { alignment: "center", width: 13 }, // Expiry
        6: { alignment: "right", width: 7 }, // Strike
        7: { alignment: "center" }, // Put or Call
        8: { alignment: "right", width: 7 }, // Trade price
        9: { alignment: "right", width: 10 }, // Total amount
        10: { alignment: "right", width: 7 }, // Commission
        11: { alignment: "right", width: 10 }, // Net cash
        12: { alignment: "center", width: 3 }, // Asset
        13: { alignment: "center" }, // Open or Close
        14: { alignment: "right", width: 3 }, // Multiplier
        15: { alignment: "left", width: 8 }, // Notes
        16: { alignment: "center", width: 10 }, // Result
    },
});

const body = {
    url,
    method: "POST",
    headers: {
        "content-type": "application/json",
    },
};

numeral.defaultFormat("$0,0.00");

module.exports = json => {
    stream.write(header);
    try {
        json.forEach(trade => {
            body.json = trade;
            request(body, (err, res) => {
                if (err) throw err;
                if (res.statusCode === 201) stream.write(formatRow(res.body));
                else if (res.statusCode === 400) {
                    const errors = Object.keys(res.body.errors);
                    errors.forEach(col => {
                        if (!trade[col]) trade[col] = "?";
                        trade[col] = error(trade[col]);
                    });
                    trade.symbol = trade.symbol.slice(0, 4);
                    row = Object.values(trade);
                    row.unshift(error(res.body._message));
                    row.push(error("FAILED"));
                    stream.write(row);
                }
            });
            return true;
        });
    } catch (e) {
        console.log("\n", error(e.message));
    }
};

/*
** If I choose to format the numbers in trades that have errors
** then move this code to line 92 trade.symbol ...

                    // if (!errors.includes("tradePrice"))
                    //     trade.tradePrice = numeral(trade.tradePrice).format();
                    // if (!errors.includes("proceeds"))
                    //     trade.proceeds = numeral(trade.proceeds).format();
                    // if (!errors.includes("commission"))
                    //     trade.commission = numeral(trade.commission).format();
                    // if (!errors.includes("netCash"))
                    //     trade.netCash = numeral(trade.netCashon).format();

*/
