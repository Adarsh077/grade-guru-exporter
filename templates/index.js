const fs = require("fs");
const Handlebars = require("handlebars");

const resultTemplate = fs.readFileSync("templates/result.hbs", "utf-8");

module.exports = {
  resultTemplate: Handlebars.compile(resultTemplate),
};
