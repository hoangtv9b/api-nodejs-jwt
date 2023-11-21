const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const refreshToken = new mongoose.Schema(
    {
        idUser: {
            type: String,
            unique: true
        },
        refreshToken: {
            type: String,
            minlength: 10,
            unique: true
        }
    },
    {timestamps: true}
)
module.exports = mongoose.model("refreshToken", refreshToken);