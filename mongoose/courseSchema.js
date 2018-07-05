const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*

Sat course schema for stroing taken courses


*/

const CourseSchema = new Schema
({
    name:
    {
        type: String,
    },
});

const TempCourseSchema = new Schema
({
    name:
    {
        type: String,
    },
    dateTaken:
    {
        type: Date
    },
    duration:
    {

    }
})

module.exports.CourseSchema = CourseSchema;
module.exports.TempCourseSchema = TempCourseSchema;
