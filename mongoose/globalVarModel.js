const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GlobalVariablesSchema = new Schema
({
    acceptNominee:
    {        
        type: Boolean,
        default: false
    },
    satCounter:
    {
        type: Number,
        default: 0
    },
});

// Models
const GlobalVariables = mongoose.model('globals', GlobalVariablesSchema);

GlobalVariablesSchema.pre('save', (next) =>
{
    GlobalVariables.findOne({}, (err, globals) =>
    {
        if(err) return next(err);
        if(globals)
        {
           return next(new Error("Global Model can only have single document.")) ;
        }
        next();
    });
});

module.exports.GlobalVariables = GlobalVariables;