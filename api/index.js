require('dotenv').config();

const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const routes = require('../routes/routes'); // Adjust path if needed

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error('MONGO_URI environment variable not set');
  process.exit(1);
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

app.use('/api', routes);

module.exports = serverless(app);
