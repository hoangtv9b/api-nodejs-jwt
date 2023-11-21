const mongoose = require("mongoose");

const userMongoose = new mongoose.Schema(
    {
    username: {
        type: String,
        minlength: 4,
        maxlength: 20,
        unique: true,
        required: true
    },
    password: {
        type: String,
        minlength: 8,
        required: true
    },
    email: {
        type: String,
        minlength: 10,
        maxlength: 30,
        required: true,
        unique: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }

},
{timestamps: true}
)
module.exports = mongoose.model("User", userMongoose);