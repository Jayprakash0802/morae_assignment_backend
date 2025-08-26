require('dotenv').config();

const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const routes = require('../routes/routes'); // Adjust path if needed

const app = express();

const allowedOrigins = ['https://morae-assignment.vercel.app', 
    'https://morae-assignment-git-main-jay-prakashs-projects-49a6d6b0.vercel.app/',
    'https://morae-assignment-c8dpd52e7-jay-prakashs-projects-49a6d6b0.vercel.app/',
  ];

const corsOptions = {
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      return callback(new Error('Not allowed by CORS'), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};


app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
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
