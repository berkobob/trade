const chalk = require("chalk");
const request = require("request");

const { colour, url } = require("./utils");
const Stream = require("./trade-stream");

const body = {
    url: url.local,
    method: "POST",
    headers: {
        "content-type": "application/json",
    },
};

module.exports = json => {
    const stream = new Stream();
    try {
        json.forEach(trade => {
            body.json = trade;
            request(body, (err, res) => {
                if (err) throw err;
                if (res.statusCode === 201) stream.write(res.body);
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
        colour.error("\n" + e.message);
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
