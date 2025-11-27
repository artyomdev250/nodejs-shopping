const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    stock: Number,
    description: String,
    brand: String
});

module.exports = mongoose.model("items", ItemSchema);
