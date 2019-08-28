/**
 * Created by Peter on 2019-08-28.
 */

const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    proxy(["/api"], { target: "http://localhost:3001" })
  );
};