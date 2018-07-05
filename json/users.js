const express = require('express');
const router = express.Router();
const User = require('../mongoose/userModel').User;

const authAnyUser = require('../authentication').authAnyUser;
const authAnyUserId = require('../authentication').authAnyUserId;
const authElevatedUser = require('../authentication').authElevatedUser;
const authAdminUser = require('../authentication').authAdminUser;

// Static Vars
const usersApiPath = process.env.USER_API_NAME || 'users';

// GET
router.get(`/${usersApiPath}`, (req, res, next) =>
{
    if(!authAnyUser(req))
        return res.status(403).send(`Forbidden: You cannot access users.`);

    // Query and return users
});

router.get(`/${usersApiPath}/:id`, (req, res, next) =>
{   
    if(!authAnyUser(req))
        return res.status(403).send(`Forbidden: You cannot access users SAT${id}.`);

    // Query and return user
});

// POST
router.post(`/${usersApiPath}/:id`, (req, res, next) =>
{
    if(!authAnyUserId(req, id));
        return res.status(403).send(`Forbidden: You cannot edit SAT${id}.`);

    // Find user and update user
});

router.post(`/${usersApiPath}/migrate`, (req, res, next) =>
{
    if(!authElevatedUser(req, id));
        return res.status(403).send(`Forbidden: You cannot migrate users.`);

    // Body should containt all data of the nominee
    // Find nomineee
    // Crete new user
    // Return new user
});

// PUT
router.put(`/${usersApiPath}/:id`, (req, res, next) =>
{
    if(!authAdminUser(req))
        return res.status(403).send(`Forbidden: Only admins can add users.`);

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