require('dotenv').config();

const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const routes = require('./routes/routes'); // Adjust path if needed

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
  origin: [
    'https://morae-assignment.vercel.app',
    'https://morae-assignment-git-main-jay-prakashs-projects-49a6d6b0.vercel.app',
    'https://morae-assignment-c8dpd52e7-jay-prakashs-projects-49a6d6b0.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// app.options('*', cors()); // Always after app.use(cors())


const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error('MONGO_URI environment variable not set');
  process.exit(1);
}

mongoose.connect(mongoURI)
.then(() => console.log('MongoDB connected'))
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = serverless(app);
