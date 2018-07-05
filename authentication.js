const express = require('express');
const router = express.Router();
const User = require('./mongoose/userModel').User;
const jwt = require('jsonwebtoken');

const secretKey = 'sat1985-kgt-acy-ba-sk-st';
const expirationTime = 500; // hours

function authLayer(req, res, next)
{
    if(!req.headers.authorization)
        return next({status: 403, message: 'authorization header is mandatory for satsuma.'});
    
    const bearer = req.headers.authorization.split(' ');
    const token = bearer[1];

    // Base authentication 
    // SAT api is fully proceted
    jwt.verify(token, secretKey, (err, data) =>
    {
        if(err) return next(err);
        
        // Can i blindly thrust these after verify??
        req.privilege = data.privilege;
        req.satId = data.satId;
        next();
    });
};

router.get('/login/admin', (req, res, next) =>
{
    // Init admin for development
    const initAdmin = process.env.ADMIN || false;
    if(initAdmin)
    {
        User.create(
        {
            satId: 866, 
            eMail: 'yalciner.bora@metu.edu.tr',
            lName: 'Yalciner',
            fName: 'Bora',
            password: 'pass123',
            privilege: 'admin'
        },         
        (err, user) =>
        {
            if(err) return next(err);
            return res.json(user);
        });
    }
});

router.post('/login', (req, res, next) =>
{
    if(!req.body.password) return next({statusCode: 400, message: 'password is not given'});

    // Verify User and password
    User.findOne({satId: req.body.satId}, (err, user) =>
    {
        if(err) return next(err);
        if(!user) return next({statusCode: 404, message: 'user not found.'});

        user.comparePassword(req.body.password, (err, isMatch) =>
        {
            if(err) return next(err);
            if(!isMatch) return next({statusCode: 400, message: 'password is incorrect.'});
            else
            {                
                // Sign and send
                jwt.sign(
                {
                    satId: user.satId, 
                    privilege: user.privilege
                }, 
                secretKey, 
                {expiresIn: `${expirationTime}h`}, 
                (err, token) =>
                {
                    if(err) return next(err);
                    res.json({token: token});
                });
            }
        });
    });    
});

// Accessor convenience
function anyUser(req)
{
    return true;    
};

function anyUserId(req, id)
{
    return ((req.privilege === 'active' && (req.satId === id)) ||
            req.privilege === 'elevated' ||
            req.privilege === 'admin');
}

function elevatedUser(req)
{
    return (req.privilege === 'elevated' ||
            req.privilege === 'admin');
}

function adminUser(req)
{
    return (req.privilege === 'admin');
}

module.exports.authLayer = authLayer;
module.exports.loginRouter = router;

// Convenience
module.exports.authAnyUser = anyUser;
module.exports.authAnyUserId = anyUserId;
module.exports.authElevatedUser = elevatedUser;
module.exports.authAdminUser = adminUser;