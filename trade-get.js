const program = require('commander');
const request = require('request');

const { url } = require('./utils');
const Stream = require('./trade-stream');

program
    .description('Get all the trades that match your search criteria')
    .option('-s, --sum', 'Calculate profit for closed trades')
    .option('-c, --closed', 'Only get closed trades')
    .option('-o, --open', 'Only get open trades')
    .parse(process.argv);

// console.log("Symbols", program.args);
// console.log("Sum", program.sum);
// console.log("closed", program.closed);
// console.log("open", program.open);

const stream = new Stream();

if (program.args.length === 0) program.args[0] = ' ';

program.args.forEach(symbol => {
    request(
        { url: url.local + '?symbol=' + symbol, body: 'Antoine' },
        (err, res) => {
            if (err) throw err;
            JSON.parse(res.body).forEach(trade => stream.write(trade));
        }
    );
});
