const createStream = require('table').createStream;
const numeral = require('numeral');

const { colour } = require('./utils');

numeral.defaultFormat('$0,0.00');

class Stream {
    constructor() {
        this.formatRow = row => {
            row.open = numeral(row.open.length).format('00');
            row.closed = numeral(row.closed.length).format('00');
            row.proceeds = numeral(row.proceeds).format(); // proceeds
            row.commission = numeral(row.commission).format(); // commission
            row.netCash = numeral(row.netCash).format(); // net cash
            return Object.values(row);
        };

        /*
         ** The column headings for the results table
         */
        const header = [
            colour.heading('Symbol        '),
            colour.heading('   Closed  '),
            colour.heading('    Open   '),
            colour.heading('       Proceeds'),
            colour.heading('     Commission'),
            colour.heading('       Net Cash'),
        ];

        /*
         ** Configure the table columns of the results table
         ** and the stream to populate the table
         */
        const streamConfig = {
            columnDefault: {
                width: 1,
            },
            columnCount: 6,
            columns: {
                0: { alignment: 'left', width: 16 }, // Symbol
                1: { alignment: 'center', width: 14 }, // Open
                2: { alignment: 'center', width: 14 }, // Closed
                3: { alignment: 'right', width: 16 }, // Proceeds
                4: { alignment: 'right', width: 16 }, // Commission
                5: { alignment: 'right', width: 16 }, // Net Cash
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
