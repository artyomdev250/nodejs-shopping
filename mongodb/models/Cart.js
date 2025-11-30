const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: "items", required: true },
    quantity: { type: Number, default: 1 }
});

const CartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    items: [CartItemSchema]
});

module.exports = mongoose.model("carts", CartSchema);
