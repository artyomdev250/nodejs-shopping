const Cart = require("../../mongodb/models/Cart");
const Item = require("../../mongodb/models/Item");

exports.addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId, quantity } = req.body;

        // Validate item exists
        const item = await Item.findById(itemId);
        if (!item) return res.status(404).json({ message: "Item not found" });

        // Find user cart
        let cart = await Cart.findOne({ userId });

        // If cart doesn't exist, create one
        if (!cart) {
            cart = new Cart({
                userId,
                items: [{ itemId, quantity: quantity || 1 }]
            });
        } else {
            // Check if item already exists in cart
            const existingItem = cart.items.find(i => i.itemId.toString() === itemId);

            if (existingItem) {
                // Increase quantity
                existingItem.quantity += quantity || 1;
            } else {
                // Add new item
                cart.items.push({ itemId, quantity: quantity || 1 });
            }
        }

        await cart.save();
        return res.status(200).json({ message: "Added to cart", cart });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId, quantity } = req.body;

        if (!itemId) {
            return res.status(400).json({ message: "itemId is required" });
        }

        // Find user's cart
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Locate item inside cart
        const itemIndex = cart.items.findIndex(
            (i) => i.itemId.toString() === itemId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not in cart" });
        }

        const cartItem = cart.items[itemIndex];

        // CASE 1: No quantity provided → remove entire item
        if (!quantity) {
            cart.items.splice(itemIndex, 1);
        }
        else {
            const removeAmount = Number(quantity);

            // Subtract requested amount
            cartItem.quantity -= removeAmount;

            // If quantity goes to zero or below → remove item
            if (cartItem.quantity <= 0) {
                cart.items.splice(itemIndex, 1);
            }
        }

        await cart.save();

        return res.status(200).json({
            message: "Item updated in cart",
            cart
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        // Populate item data so we can access price
        const cart = await Cart.findOne({ userId }).populate("items.itemId");

        if (!cart) {
            return res.status(200).json({
                items: [],
                totalItems: 0,
                subtotal: 0,
                totalCost: 0
            });
        }

        // Calculate totals
        let totalItems = 0;
        let subtotal = 0;

        cart.items.forEach(cartItem => {
            const price = cartItem.itemId.price;
            const quantity = cartItem.quantity;

            totalItems += quantity;
            subtotal += price * quantity;
        });

        return res.status(200).json({
            cart,
            totalItems,
            subtotal,
            totalCost: subtotal
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the user's cart
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(200).json({
                message: "Cart is already empty",
                cart: { items: [] }
            });
        }

        // Clear it
        cart.items = [];
        await cart.save();

        return res.status(200).json({
            message: "Cart cleared successfully",
            cart
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
