const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
const CourseSchema = require('./courseSchema').CourseSchema;
const TempCourseSchema = require('./courseSchema').TempCourseSchema;
const GlobalVariables = require('./globalVarModel').GlobalVariables;

/*

Sat Users

Three privilege levels (one secret privilege)

- Nominee (stored in a different collection)
- Active (normal user cannot access)
- Elevated ('K' members, most of the time elevation is only for a semester, except for maybe seniors and academic consult)

- Admin (can access to everything and should not be used as a use case (usred for debug etc))

- After nominees are selected an elevated user can select the users from nominee collection and it automatically adds
them to the actual user collection

*/

const eMailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const phoneNumberRegex = /[0-9]{7}/;
const numberRegex = /[0-9]+/;

const NomineeSchema = new Schema
({
    lName: 
    {
        type: String,
        required: [true, 'First name is required']
    },
    fName: 
    {
        type: String,
        required: [true, 'Last name is required']
    },
    eMail:
    {
        type: String,
        required: [true, 'e-mail is mandatory.'],
        match: [eMailRegex, 'e-mail is invalid.']
    },
});

//
const UserSchema = new Schema
({
    // Required
    satId: 
    {
        type: Number,
        defaults: 0,
        //required: [true, 'SAT Id is required.'],
        unique: true
    },
    lName: 
    {
        type: String,
        required: [true, 'First name is required.']
    },
    fName: 
    {
        type: String,
        required: [true, 'Last name is required.']
    },
    eMail:
    {
        type: String,
        required: [true, 'e-mail is mandatory.'],
        match: [eMailRegex, 'e-mail is invalid.']
    },
    password:
    {
        type: String,
        required: [function() {return typeof this.password === 'string'? false : true}, 'password is mandatory.'],
        select: false
    },
    privilege:
    {
        type: String,
        enum: ['active', 'elevated', 'admin'],
        required: [true, 'user should have a privilege type.']
    },
    // Contact
    phoneIntlCode:
    {
        type: String,
        match: [/\+[0-9]+/, 'invalid phone number country code.'],
        default: '+90',
    },
    phoneNo:
    {
        type: String,
        maxlength: [7, 'phone number is too long or short.'],
        minlength: [7, 'phone number is too long or short.'],
        match: [phoneNumberRegex, 'phone number contains characters.'],
        default: '0000000',
    },
    adress:
    {
        type: String,
        default: '',
    },
    // Scuba Ranks
    satRank:
    {
        type: String,
        enum: ['basic', 'advance', 'rescure', '...', ],        
    },
    padiRank:
    {
        type: String,
        enum: ['unranked', 'owd', 'aowd', 'rescue', 'divemaster', 'owsi', 'owsi+'],
        default: 'unranked'
    },
    padiBrevetNo:
    {
        type: String,
        match: [phoneNumberRegex, 'invalid PADI brevet number.']
    },
    cmasRank:
    {
        type: String,
        enum: ['unranked', '1*', '2*', '3*', '1*i', '2*i', '3*i', '3*i+'],
        default: 'unranked'
    },
    cmasBrevetNo:
    {
        type: String,
        match: [numberRegex, 'invalid CMAS brevet number.']
    },
    // Vitals
    bloodType:
    {
        type: String,
        enum: ['0rh+', '0rh-', 'Arh+', 'Arh-', 'Brh+', 'Brh-', 'ABrh+', 'ABrh-']
    },
    disease:
    {
        type: [new Schema({name: String})]
    },
    // Emergency Call
    parentName:
    {
        type: String,
    },
    parentPhoneIntlCode:
    {
        type: String,
        match: [/\+[0-9]+/, 'invalid phone number country code.'],
        default: '+90',
    },
    parentPhoneNo:
    {
        type: String,
        maxlength: [7, 'phone number is too long or short.'],
        minlength: [7, 'phone number is too long or short.'],
        match: [numberRegex, 'phone number contains characters.'],
        default: '0000000',
    },
    // Courses
    satCourses:
    {
        type: [CourseSchema]
    },
    tempCurses:
    {
        type: [TempCourseSchema]
    }
});

// Virtuals
UserSchema.virtual('fullName').get(()=>
{
    return this.fName + ' ' + this.lName;
});

UserSchema.virtual('fullPhone').get(()=>
{
    return this.phoneIntlCode + ' ' + 
            this.phoneNo.substring(0, 4) + ' ' + 
            this.substring(4, 6) + ' ' + 
            this.substring(6, 8);
});

UserSchema.virtual('emergencyFullPhone').get(()=>
{
    return this.parentPhoneIntlCode + ' ' + 
            this.parentPhoneNo.substring(0, 4) + ' ' + 
            this.substring(4, 6) + ' ' + 
            this.substring(6, 8);
});

// Methods
UserSchema.methods.comparePassword = function(candidatePassword, callback) 
{
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) 
    {
        if (err) return callback(err);
        callback(null, isMatch); 
    });
};

// Model
const User = mongoose.model('user', UserSchema);
const Nominee = mongoose.model('nominee', NomineeSchema);

// Pre-save functions

// Sat no auto increment
UserSchema.pre('save', function (next)
{
    var user = this;
    if(user.satId) return next();
    GlobalVariables.findOneAndUpdate({}, 
    { 
        $inc: { satCounter: 1}
    },
    (err, globals) =>
    {
        console.log(globals.satCounter);
        if(err) throw err;
        const newSatNo = globals.satCounter + 1;
        user.satId = newSatNo;
        next();
    });
});

// Password salt
UserSchema.pre('save', function (next)
{  
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(bcrypt.SALT_WORK_FACTOR, function(err, salt)
    {
        if(err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) 
        {
            if(err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

module.exports.User = User;
module.exports.Nominee = Nominee;