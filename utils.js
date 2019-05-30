const numeral = require("numeral");
const chalk = require("chalk");

const success = chalk.green.inverse.bold;

numeral.defaultFormat("$0,0.00");

function formatRow(row) {
    // trade date
    row.date = new Date(row.date);
    row.date = row.date.toLocaleDateString("en-uk");

    // expiry
    if (row.expiry) {
        row.expiry = new Date(row.expiry);
        row.expiry = row.expiry.toLocaleDateString("en-uk");
    }

    row.tradePrice = numeral(row.tradePrice).format(); // trade price
    row.proceeds = numeral(row.proceeds).format(); // proceeds
    row.commission = numeral(row.commission).format(); // commission
    row.netCash = numeral(row.netCash).format(); // net cash
    row.__v = success("SUCCESS"); // __v becomes result

    // return values as an array
    return Object.values(row);
}

module.exports = { formatRow };
