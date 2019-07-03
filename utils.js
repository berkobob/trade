const chalk = require("chalk");

const colour = {
    heading: chalk.blue.inverse.bold,
    warning: msg => console.log(chalk.yellow.inverse.bold("WARNING:"), msg),
    error: msg => console.log(chalk.red.inverse.bold("ERROR:"), msg),
    success: msg => console.log(chalk.green.inverse.bold("SUCCESS:"), msg),
    uploaded: chalk.green.inverse,
    bold: chalk.yellow.inverse.bold,
    positive: chalk.green.inverse.bold,
    negative: chalk.red.inverse.bold,
};

const url = "https://mytradelog.herokuapp.com/api";
// const url = 'http://localhost:3000/api';
// const url = 'error';

module.exports = {
    colour,
    url,
};
