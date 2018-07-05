const express = require('express');
const mongoose = require('mongoose');
const satAuth = require('./authentication').authLayer;

const userRoutes = require('./json/users');
const loginRouter = require('./authentication').loginRouter;

// Statics
const jsonApiName = process.env.API_NAME ||'satsuma' ;
const port = process.env.PORT || 3000;
const mongoDBAdress = process.env.DB_ADRESS || 'mongodb://localhost/satsuma';

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
app.use(`/${jsonApiName}`, express.json());
// Auth layer
app.use(`/${jsonApiName}`, loginRouter);
app.use(satAuth);
// Route Layer
app.use(`/${jsonApiName}`, userRoutes);
// Error Layer
app.use((err, req, res, next) =>
{
    console.log(err.message);
    if(!err.statusCode) err.statusCode = 500;
    return res.status(err.statusCode).json({statusCode: err.statusCode, error: err.message});
});

// MongoDB
mongoose.connect(mongoDBAdress);

// Server Startup
app.listen(port, () =>
{
    console.log(`Listenting on port ${port}`);
})