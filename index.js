const express = require('express');
const cors = require('cors');
const connectToMongo = require('./db');

connectToMongo();
const app = express();
const port = 5000;

// CORS configuration
const corsOptions = {
  origin: 'https://tablebookingsystemKrs20.netlify.app', // Your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization', 'auth-token'] // Allowed headers
};

app.use(cors(corsOptions));
app.use(express.json());

// Available Routes
app.use('/api/reservation', require('./routes/reservation'));

app.listen(port, () => {
  console.log(`iNotebook backend listening at http://localhost:${port}`);
});
