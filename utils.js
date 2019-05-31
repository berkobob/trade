const chalk = require("chalk");

const colour = {
    heading: chalk.blue.inverse.bold,
    warning: msg => console.log(chalk.yellow.inverse.bold("WARNING:"), msg),
    error: msg => console.log(chalk.red.inverse.bold("ERROR:"), msg),
    success: msg => console.log(chalk.green.inverse.bold("SUCCESS:"), msg),
    uploaded: chalk.green.inverse,
};

const url = {
    heroku: "https://mytradelog.herokuapp.com/api",
    local: "http://localhost:3000/api",
    error: "error",
};

module.exports = {
    colour,
    url,
};
