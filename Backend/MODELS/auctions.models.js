
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    user_name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    postedItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "items"
    }],
    bids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "bid"
    }],
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


const itemSchema = new mongoose.Schema({
    prodTitle: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    Overview: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    itemPhotos: {
        type: [String],
        required: true
    },
    uploder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    bidders: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "users"
    },
    accepted: {
        type: Boolean,
        default: false
    }
});


const bidSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "items",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
});

module.exports = {
    userSchema,
    itemSchema,
    bidSchema
};