const express = require('express');
const router = express.Router();
const User = require('../mongoose/userModel').User;

// HTTP Methods
router.get('/users/:id', (req, res, next) =>
{    
    // const course = courses.find(c => c.id === parseInt(req.params.id));

    // User.findById(req.params.id, (err, user) =>
    // {        
    //     res.send(user);
    // });
    
    // if(!course) return res.status(404).send(`User with the given id ${req.params.id} not found`);
    // res.send(course);
});

router.get('/users', (req, res, next) =>
{
    res.send(`users get, auth ${req.privilege}, id ${req.satId}`);
});

router.post('/users', (req, res, next) =>
{
    // // Validate
    // const { error } = validateCourse(req.body);
    // if(error) return res.status(400).send(error.details[0].message);

    // // Add
    // let user = new User.create(req.body).then((user) =>
    // {
    //     res.send(user);
    // }).catch(next);

    // res.send(course);
});

router.put('/users/:id', (req, res, next) =>
{
    // // Find
    // const course = courses.find(c => c.id === parseInt(req.params.id));


    // if(!course) return res.status(404).send(`Course with the given id ${req.params.id} not found`);

    // // Validate
    // const { error } = validateCourse(req.body);
    // if(error) return res.status(400).send(error.details[0].message);

    // // Update
    // course.name = req.body.name;
    // res.send(course);
});

router.delete('/users/:id', (req, res, next) =>
{
    // const course = courses.find(c => c.id === parseInt(req.params.id));
    // if(!course)  return res.status(404).send(`Course with the given id ${req.params.id} not found`);

    // const index = courses.indexOf(course);
    // courses.splice(index, 1);

    // res.send(course);
});

module.exports = router;