const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv')
const passport = require('passport');
const passportConfig = require('./config/passport')
const authRoutes = require('./routes/auth')
const transactionRoutes = require('./routes/transaction')

dotenv.config()

const PORT = process.env.PORT

const app = express();

// Use the body-parser middleware to parse the request body
app.use(bodyParser.json());
app.use(express.json())
app.use(cors())
app.use(passport.initialize());
passportConfig(passport);

app.use('/auth', authRoutes)
app.use('/transaction', transactionRoutes)


const uri = process.env.MONGODB_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("successfully connected to MongoDB!");
  }
  catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process with failure
  }
};

connectDB();


// Set up a route that responds to a POST request to the '/users' path
app.get('/', (req, res) => {
  res.json({message: 'Welcome'})
  
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});