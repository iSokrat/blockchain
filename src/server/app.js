const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./routes');
const nodesRouter = require('./routes/nodes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Routes
app.use('/', routes);
app.use('/nodes', nodesRouter);

module.exports = app;
