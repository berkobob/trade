const createStream = require("table").createStream;
const numeral = require("numeral");
const moment = require("moment");

const { colour } = require("./utils");

numeral.defaultFormat("$0,0.00");

class Stream {
    constructor() {
        this.formatRow = row => {
            row.date = moment(row.date).format("DD/MM/YY");
            if (row.expiry) row.expiry = moment(row.expiry).format("DD/MM/YY");
            row.tradePrice = numeral(row.tradePrice).format(); // trade price
            row.proceeds = numeral(row.proceeds).format(); // proceeds
            row.commission = numeral(row.commission).format(); // commission
            row.netCash = numeral(row.netCash).format(); // net cash
            row.__v = colour.uploaded("SUCCESS"); // __v becomes result
            return Object.values(row);
        };

        /*
         ** The column headings for the results table
         */
        const header = [
            colour.heading("          ID         "),
            colour.heading(" Date "),
            colour.heading(""),
            colour.heading("Qty"),
            colour.heading("Symbol"),
            colour.heading("  Expiry  "),
            colour.heading("Strike"),
            colour.heading(""),
            colour.heading(" Trade "),
            colour.heading(" Total "),
            colour.heading(" Comm "),
            colour.heading(" Net Cash "),
            colour.heading(""),
            colour.heading(""),
            colour.heading("Mul"),
            colour.heading(" Notes  "),
            colour.heading("RESULT "),
        ];

        /*
         ** Configure the table columns of the results table
         ** and the stream to populate the table
         */
        const streamConfig = {
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
        };

        this.stream = createStream(streamConfig);
        this.stream.write(header);
    }

    write(row) {
        this.stream.write(this.formatRow(row));
    }

    error(row) {
        this.stream.write(row);
    }
}

module.exports = Stream;
