const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDb = require('./config/configDb');
// to configure the dot env file
dotenv.config();


// database call
connectDb()

// Express application object
const app = express();

// middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// routes
app.get("/", (req,res) => {
    res.send("<h1>Let's do something crazy</h1>");
});


// port 
const PORT = 8080 || process.env.PORT;


// listen server
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
})