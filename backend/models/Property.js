const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    image: {
        type: String,
        default: ""
    },

    category: {
        type: String,
        enum: ["Villa", "Apartment", "Family Home"],
        required: true
    },

    description: {
        type: String,
        default: ""
    },
    bedrooms: {
        type: Number,
        required: true
    },

    bathrooms: {
        type: Number,
        required: true
    },

    area: {
        type: String,
        required: true
    },
    map: {
        type: String,
        default: ""
    },

}, {
    timestamps: true
});

module.exports = mongoose.model("Property", propertySchema);