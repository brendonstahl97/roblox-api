const express = require('express');
const mongoose = require("mongoose");

//Create express app and define port
const app = express();
const PORT = process.env.PORT || 8080;

//Data parsing setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));

//Database Connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/Roblox_Test", { 
    useNewUrlParser: true
});

//Routing information
require('./Routes/apiRoutes')(app);
require('./Routes/htmlRoutes')(app);

//Start the server
app.listen(PORT, () => {
    console.log('App listening on PORT: ' + PORT);
});