const express = require("express");
const mongoose = require("mongoose")
const cors = require("cors");
const bodyParser = require('body-parser');

const app = express()

app.use(express.json())
app.use(bodyParser.json());

app.use(cors())

const CategoriesRoute = require('./routes/categories');
const ServicesRoute = require('./routes/services');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/serviceApp', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Check for database connection errors
db.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

// Check if connected to the database
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use('/api/v1/categorie', CategoriesRoute);
app.use('/api/v1/service', ServicesRoute);

app.listen(3000, ()=>{console.log("Server Connnected Successfully")})