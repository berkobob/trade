// import { createStream } from "table";
const createStrem = require("table").createStream;

let config, stream, i;

config = {
    columnDefault: {
        width: 50,
    },
    columnCount: 3,
    columns: {
        0: {
            width: 10,
            alignment: "right",
        },
        1: {
            alignment: "center",
        },
        2: {
            width: 10,
        },
    },
};

stream = createStream(config);

i = 0;

setInterval(() => {
    let random;

    random = random(1, 30).join("");

    stream.write([i++, new Date(), random]);
}, 500);
