const createStream = require("table").createStream;
const numeral = require("numeral");
const moment = require("moment");

const { colour } = require("./utils");

numeral.defaultFormat("$0,0.00");

class Stream {
    constructor() {
        this.formatRow = row => {
            return [
                moment(row.open).format("DD/MM/YY"),
                row.trades[0].symbol,
                row.quantity,
                row.trades[0].strike
                    ? numeral(row.trades[0].strike).format()
                    : "",
                row.trades[0].expiry
                    ? moment(row.trades[0].expiry).format("DD/MM/YY")
                    : "",
                row.trades[0].putOrCall,
                numeral(row.proceeds).format(),
                numeral(row.commission).format(),
                numeral(row.netCash).format(),
                row.trades[0].assetClass,
                row.trades[0].multiplier,
            ];
        };

        /*
         ** The column headings for the results table
         */
        const header = [
            colour.heading("   Open  "),
            colour.heading("Symbol      "),
            colour.heading(" Quantity"),
            colour.heading("   Strike"),
            colour.heading("  Expiry "),
            colour.heading("  P/C "),
            colour.heading("       Proceeds"),
            colour.heading("     Commission"),
            colour.heading("       Net Cash"),
            colour.heading("Asset "),
            colour.heading("Multiplier"),
        ];

        /*
         ** Configure the table columns of the results table
         ** and the stream to populate the table
         */
        const streamConfig = {
            columnDefault: {
                width: 1,
            },
            columnCount: 11,
            columns: {
                0: { alignment: "left", width: 9 }, // Open
                1: { alignment: "left", width: 12 }, // Symbol
                2: { alignment: "right", width: 10 }, // Quantity
                3: { alignment: "right", width: 10 }, // Stike
                4: { alignment: "right", width: 9 }, // Expiry
                5: { alignment: "center", width: 6 }, // Put or Call
                6: { alignment: "right", width: 16 }, // Proceeds
                7: { alignment: "right", width: 16 }, // Commission
                8: { alignment: "right", width: 16 }, // Net Cash
                9: { alignment: "center", width: 6 }, // Asset
                10: { alignment: "right", width: 10 }, // Multiplier
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
