const mongoose = require('mongoose')

const msgSchema = mongoose.Schema({
    senderId: {type: String},
    reciverId: {type: String},
    msg: {type: String}
}, { timestamps: true })

const Message = mongoose.model("Message", msgSchema)
module.exports = Message