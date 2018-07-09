const express = require('express');
const router = express.Router();

const Nominee = require('../mongoose/userModel').Nominee;
const User = require('../mongoose/userModel').User;

// Auth Funcs
const authAnyUser = require('../authentication').authAnyUser;
const authAnyUserId = require('../authentication').authAnyUserId;
const authElevatedUser = require('../authentication').authElevatedUser;
const authAdminUser = require('../authentication').authAdminUser;

module.exports = router;

const ykActionPath = process.env.USER_API_NAME || 'yk';

// YK Actions
router.put(`/${ykActionPath}/migrate/:id`, (req, res, next) =>
{
    if(!authElevatedUser(req))
        return res.status(403).json('Forbidden: Only YK can migrate users.');
    // Check if nominee with that id exits
    Nominee.findById(req.params.id, (err, nominee) =>
    {
        if(err) return next(err);
        if(!nominee) return res.status(404).json('Nominee not found');
        
        User.create(
        {            
            eMail: nominee.eMail,
            lName: nominee.lName,
            fName: nominee.fName,
            password: '',
            privilege: 'active'
        },
        (err, user) =>
        {
            if(err) return next(err);
            return res.json(user);
        });

        // Delete from nominee
        Nominee.deleteOne({_id: req.params.id}, (err) =>
        {
            if(err) return next(err);
        });
    });
});

// Enable nominee

// Disable nominee