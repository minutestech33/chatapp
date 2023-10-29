const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    title: {type: String},
    username: { type: String},
    password: { type: String},
    profile: { type: String}
}, { timestamps: true })

const User = mongoose.model("User", userSchema)
module.exports = User