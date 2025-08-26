require('dotenv').config();

const express = require('express');
const mongoose =  require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(bodyParser.json());
const mongoURI = process.env.MONGO_URI;

const routes = require('./routes');

app.use(express.json());
app.use('/api', routes);

mongoose.connect(mongoURI);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});