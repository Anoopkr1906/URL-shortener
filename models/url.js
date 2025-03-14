const mongoose  = require("mongoose");

const urlSchema = new mongoose.Schema({
    shortId:{
        type: String,
        reuired: true,
        unique: true,
    },

    redirectUrl:{
        type: String,
        required: true,
    },

    visitHistory:[ {timestamp: {type: Number}} ],

},
{timestamps: true}
);


const URL = mongoose.model('url', urlSchema);

module.exports = URL ;