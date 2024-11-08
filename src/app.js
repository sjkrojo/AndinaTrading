const express = require('express');
const morgan = require('morgan');
const path = require('path')
const exphbs = require("express-handlebars");

const app = express();

app.set('views', path.join(__dirname, 'views') )
app.engine('.hbs', exphbs.create({
    defaultLayout: 'main',
    extname: '.hbs',
}).engine);
app.set('view engine', '.hbs')

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}));

// routes
app.use(require("./routes/index"));
app.use('/api/companies',require("./routes/companies"));
app.use('/api/countries',require("./routes/countries"));
app.use('/api/securityhouses',require("./routes/securityhouses"));
app.use('/api/investors', require("./routes/investor"));
app.use('/api/contractCreat', require("./routes/contractCreat"));
app.use('/api/secondmodule', require("./routes/secondmodule"));
app.use('/api/fithmodule', require("./routes/fithmodule"));
app.use('/api/reports', require("./routes/reports"));
app.use('/api/sixthmodule', require("./routes/sixmodule"));
app.use('/api/logs', require("./routes/logs"));

app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;