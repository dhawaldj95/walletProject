`use strict`;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    amount: { type: Number, required: true, default: 0, min: 0 },
    // user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    user_name: { type: String, default: "" },
    status: { type: Number, required: true, default: 1, index: true },
    type_id: { type: Number, required: true, default: 0, min: 0 },

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },

});

schema.set("toJSON", { virtuals: true });
module.exports = mongoose.model("Wallet", schema);