const GlobalVariables = require('./mongoose/globalVarModel').GlobalVariables;

function init()
{
    // Generate Variable Table
    GlobalVariables.create({}, (err, globals) =>
    {
        if(err) console.log(err);
    });    
}
//
module.exports = init;