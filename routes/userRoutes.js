const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const User = require("../mongodb/models/User");

const { getAllItems } = require("../controllers/cart/getItemsController");
const { addToCart, removeFromCart, getCart, clearCart } = require("../controllers/cart/cartController");

router.get("/dashboard", auth, async (req, res) => {
    const user = await User.findById(req.user.id).select("name email");

    return res.json({
        message: `Welcome ${user.name}!`,
        user
    });
});

router.get("/items", auth, getAllItems);
router.get("/cart", auth, getCart);
router.post("/cart/add", auth, addToCart);
router.delete("/cart/remove", auth, removeFromCart);
router.delete("/cart/clear", auth, clearCart);

module.exports = router;
