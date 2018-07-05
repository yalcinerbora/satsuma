const express = require('express');
const mongoose = require('mongoose');
const satAuth = require('./authentication').authLayer;

const userRoutes = require('./json/users');
const loginRouter = require('./authentication').loginRouter;

// Express
const app = express();

// -----------
// Layers
// -----------
// Static Layer
app.use(express.static('static'));
// Frontend check layer
app.get('/', (req, res) =>
{
    res.send('index.html missing (upload satıh angular project).');
});
// Json Parse Layer
app.use('/satsuma', express.json());
// Auth layer
app.use('/satsuma', loginRouter);
app.use(satAuth);
// Route Layer
app.use('/satsuma', userRoutes);
// Error Layer
app.use((err, req, res, next) =>
{
    console.log(err.message);
    if(!err.statusCode) err.statusCode = 500;
    return res.status(err.statusCode).json({statusCode: err.statusCode, error: err.message});
});

// MongoDB
mongoose.connect('mongodb://localhost/satsuma');

// Server Startup
const port = process.env.PORT || 3000;
app.listen(port, () =>
{
    console.log(`Listenting on port ${port}`);
})