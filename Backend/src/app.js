const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const authRoutes = require('./routes/auth.routes');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Quilbox Backend API is running!');
});

app.use('/auth', authRoutes);

module.exports = app;
