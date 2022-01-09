`use strict`;
const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const https = require('https');
const util = require('util');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
require('dotenv').config();
const path = require("path");
const fs = require('fs');
const serverConfig = require('./config/serverConfig');

// const { MongodbConnectionMessage, MongodbErrorConnection, ServerSuccess } = require('./utils/static-messages');

const app = express();
let connection;
app.use(bodyParser.json({ limit: '5mb' }));
app.use(cors());
app.use(passport.initialize());


const joiRoutes = require('./routes');
const routes = require('./routes');
const { route } = require('./utils/route.utils');
// Route configured with app
route(app, joiRoutes);
// routes(app);


const connectDb = () => {
    /* Mongodb connection established here if mongodb is runing and connection string is correct */
    mongoose.connect(serverConfig.MONGODB.URL, {

    }).then(async res => {
        console.log("Successfully Connected to mongodb");
        return;
    }).catch(error => {
        console.log(`Error Connecting database ${error}`);
    });
};

let server = app.listen(serverConfig.PORT, function (err) {
    try {
        if (err) {
            return process.exit(0);
        }
        connectDb();
        console.log(`Server Started at port ${serverConfig.PORT}`);
        return true;
    } catch (error) {
        process.exit(0);
    }
});





