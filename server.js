const express = require('express');
const axios = require('axios');
const noblox = require('noblox.js');

//Create express app and define port
const app = express();
const PORT = process.env.PORT || 8080;

//Data parsing setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routing information
require('./Routes/apiRoutes')(app, noblox);

//Start the server
app.listen(PORT, () => {
    console.log('App listening on PORT: ' + PORT);
});