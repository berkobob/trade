const createStream = require("table").createStream;
const numeral = require("numeral");
const moment = require("moment");

const { colour } = require("./utils");

numeral.defaultFormat("$0,0.00");

class Stream {
    constructor() {
        this.formatRow = row => {
            let results = [
                row.symbol,
                moment(row.open).format("DD/MM/YY"),
                moment(row.closed).format("DD/MM/YY"),
                row.days,
                numeral(row.proceeds).format(), // proceeds
                numeral(row.commission).format(), // commission
                numeral(row.netCash).format(), // net cash
                numeral(row.netCashPerDay).format(),
            ];
            // return values as an array
            return results;
        };

        /*
         ** The column headings for the results table
         */
        const header = [
            colour.heading("Symbol "),
            colour.heading("   Open  "),
            colour.heading("  Closed "),
            colour.heading("      Days"),
            colour.heading("      Proceeds"),
            colour.heading("    Commission"),
            colour.heading("      Net Cash"),
            colour.heading("    Daily Cash"),
        ];

        /*
         ** Configure the table columns of the results table
         ** and the stream to populate the table
         */
        const streamConfig = {
            columnDefault: {
                width: 1,
            },
            columnCount: 8,
            columns: {
                0: { alignment: "center", width: 7 }, // Symbol
                1: { alignment: "center", width: 9 }, // Open
                2: { alignment: "center", width: 9 }, // Closed
                3: { alignment: "right", width: 10 }, // Days
                4: { alignment: "right", width: 15 }, // Proceeds
                5: { alignment: "right", width: 15 }, // Commission
                6: { alignment: "right", width: 15 }, // Net Cash
                7: { alignment: "right", width: 15 }, // Daily Cash
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

    summary(symbol) {
        this.stream.write([
            "",
            "",
            "",
            colour.bold("SUMMARY:"),
            symbol.proceeds > 0
                ? colour.positive(numeral(symbol.proceeds).format())
                : colour.negative(numeral(symbol.proceeds).format()),
            colour.negative(numeral(symbol.commission).format()),
            symbol.netCash > 0
                ? colour.positive(numeral(symbol.netCash).format())
                : colour.negative(numeral(symbol.netCash).format()),
            "",
        ]);
    }
}

module.exports = Stream;
