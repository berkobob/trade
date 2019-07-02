const program = require('commander');
const request = require('request');

const { url } = require('./utils');

program
    .description('Get all the trades that match your search criteria')
    .option('-s, --sum', 'Calculate profit for closed trades')
    .option('-c, --closed', 'Only get closed trades')
    .option('-o, --open', 'Only get open trades')
    .parse(process.argv);

if (program.args.length === 0) program.args[0] = ' ';

if (program.sum) {
    const Stream = require('./trade-stream-summary');
    const stream = new Stream();
    program.args.forEach(symbol => {
        request({ url: url.local + '?symbol=' + symbol }, (err, res) => {
            if (err) throw err;
            JSON.parse(res.body).portfolio.forEach(trade =>
                stream.write(trade)
            );
        });
    });
} else if (program.closed) {
    const Stream = require('./trade-stream-closed');
    const stream = new Stream();
    program.args.forEach(symbol => {
        request({ url: url.local + '/closed?symbol=' + symbol }, (err, res) => {
            if (err) throw err;
            JSON.parse(res.body).portfolio.forEach(symbol => {
                symbol.closed.forEach(trade => {
                    delete trade.trades;
                    trade.symbol = symbol.name;
                    stream.write(trade);
                });
                if (symbol.closed.length > 0) stream.summary(symbol);
            });
        });
    });
} else if (program.open) {
    const Stream = require('./trade-stream-trades');
    const stream = new Stream();
    program.args.forEach(reqSymbol => {
        request(
            { url: url.local + '/open?symbol=' + reqSymbol },
            (err, res) => {
                if (err) throw err;
                JSON.parse(res.body).portfolio.forEach(symbol => {
                    for (const ticker in symbol.open) {
                        let x = symbol.open[ticker].trades;
                        if (Array.isArray(x))
                            x.forEach(trade => {
                                delete trade.ticker;
                                delete trade.__v;
                                stream.write(trade);
                            });
                    }
                });
            }
        );
    });
} else {
    const Stream = require('./trade-stream-trades');
    const stream = new Stream();
    program.args.forEach(symbol => {
        request({ url: url.local + '/trades?symbol=' + symbol }, (err, res) => {
            if (err) throw err;
            JSON.parse(res.body).forEach(trade => {
                delete trade.ticker;
                delete trade.__v;
                stream.write(trade);
            });
        });
    });
}
