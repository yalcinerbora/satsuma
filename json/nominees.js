const express = require('express');
const router = express.Router();

const Nominee = require('../mongoose/userModel').Nominee;

// Static Vars
const usersApiPath = process.env.NOMINEE_API_NAME || 'nominee';

//
router.put(`/${usersApiPath}`, (req, res, next) =>
{
    Nominee.create(req.body, (err, nominee) =>
    {
        if(err) return next(err);
        res.send(nominee);
    });

    //if

    // Add nomination to dbase
});

module.exports = router;