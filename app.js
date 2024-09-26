// importing express
const express = require('express');
// to parse the body of the incoming requests
const bodyParser = require('body-parser');

const employeesRoutes = require('./EMS_Backend/routes/employees-routes');

////initializes a new Express app that can be used to define and configure web routes, middleware, and other application logic.
const app = express();

app.use(bodyParser.json());

// Connecting to the database

//middlewares
app.use('/api/employees',employeesRoutes);

// used to handle error when the api is incorrect
app.use((req, res, next) => {
    res.status(404).json({message: 'Could not find this route'});
})

// app will run on this port
app.listen(5000);