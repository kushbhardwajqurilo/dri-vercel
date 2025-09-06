const app = require("../index");

module.exports = (req, res) => {
  return app(req, res); // Delegate request to Express
};
