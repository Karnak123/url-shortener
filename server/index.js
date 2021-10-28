const express = require('express'); 								// https://www.npmjs.com/package/express
const mongoose = require('mongoose');
require('dotenv').config();

const urlRouter = require('./routes/url.routes');

// Get the port from the environment variables
const PORT = process.env.PORT || 8080;

// Get database credentials from environment variables
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;

// Define the database URL
const DB_URL = `mongodb+srv://${DB_USER}:${DB_PASS}@sandbox.dn8da.mongodb.net/Url?retryWrites=true&w=majority`

// Create the express app
const app = express();

app.use(express.json());
app.use(express.static('client'));
app.use('/url', urlRouter);

// Connect to the database
const db = mongoose.connect(DB_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(res => res)
    .catch(err => console.log(err));

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
});
