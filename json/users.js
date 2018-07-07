const express = require('express');
const router = express.Router();
const User = require('../mongoose/userModel').User;
const Nominee = require('../mongoose/userModel').Nominee;

const authAnyUser = require('../authentication').authAnyUser;
const authAnyUserId = require('../authentication').authAnyUserId;
const authElevatedUser = require('../authentication').authElevatedUser;
const authAdminUser = require('../authentication').authAdminUser;

// Static Vars
const usersApiPath = process.env.USER_API_NAME || 'users';
const nomineeApiPath = process.env.NOMINEE_API_NAME || 'nominee';

// GET
router.get(`/${usersApiPath}`, (req, res, next) =>
{
    if(!authAnyUser(req))
        return res.status(403).send(`Forbidden: You cannot access users.`);

    User.find({}, (err, users) =>
    {
        if(err) return next(err);
        return res.json(users);
    });
});

router.get(`/${usersApiPath}/:id`, (req, res, next) =>
{   
    if(!authAnyUser(req))
        return res.status(403).send(`Forbidden: You cannot access users SAT${req.params.id}.`);

    User.findOne({satId: req.params.id}, (err, user) =>
    {            
        if(err) return next(err);
        if(!user) return res.status(404).json("User not found");
        return res.json(user);
    });
});

router.get(`/${nomineeApiPath}`, (req, res, next) =>
{   
    if(!authElevatedUser(req))
        return res.status(403).send(`Forbidden: You cannot access nominees.`);
    
    Nominee.find({}, (err, users) =>
    {
        if(err) return next(err);
        return res.json(users);
    });
});

router.get(`/${nomineeApiPath}/:id`, (req, res, next) =>
{   
    if(!authElevatedUser(req))
        return res.status(403).send(`Forbidden: You cannot access nominee ${req.params.id}.`);

    Nominee.findById(req.params.id, (err, user) =>
    {            
        if(err) return next(err);
        if(!user) return res.status(404).json("Nominee not found");
        return res.json(user);
    });
});

// POST
router.post(`/${usersApiPath}/:id`, (req, res, next) =>
{
    if(!authAnyUserId(req, req.params.id))
        return res.status(403).send(`Forbidden: You cannot edit SAT${req.params.id}.`);

    // Find user and update user
    User.findOneAndUpdate(
    {
        satId: req.params.id
    }, 
    req.body, 
    {
        new: true, 
        runValidators: true
    }, (err, user) =>
    {
        if(err) return next(err);
        return res.json(user);
    });
});

// PUT
router.put(`/${usersApiPath}/:id`, (req, res, next) =>
{
    if(!authAdminUser(req))
        return res.status(403).send(`Forbidden: Only admins can directly add users.`);

    // Directly create user from body
});

// DELETE
router.delete(`/${usersApiPath}/:id`, (req, res, next) =>
{
    if(!authAdminUser(req))
        return res.status(403).send(`Forbidden: Only admins can delete users.`);

    // Directly delete user with given id
});

module.exports = router;