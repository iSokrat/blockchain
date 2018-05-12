const http = require('http');
const app = require('../app.js');
const server = http.createServer(app);
const port = process.env.PORT || 3000;

module.exports = new Promise((res, rej) => {
  server.listen(port, res);
});
