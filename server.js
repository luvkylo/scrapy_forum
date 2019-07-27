require("./config/connection.js");
const express = require("express");
const path = require('path');
const logger = require("morgan");

let PORT = process.env.PORT || 3000;

// Initialize Express
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

//set up handlebars
const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

// Use morgan logger for logging requests
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static(path.join(__dirname, 'public')));

require('./router.js')(app);

// Start the server
app.listen(PORT, () => console.log("App running on port " + PORT + "!"));