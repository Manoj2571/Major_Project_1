const mongoose = require("mongoose")

const addressSchema = mongoose.Schema(
    {   
        firstName : {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            default: 0,
            type: Number,
            required: true
        },
        additionalInfo: {
            type: String
        }
    }, {timeStamps: true}
)

const Address = mongoose.model("Address", addressSchema)

module.exports = Address
