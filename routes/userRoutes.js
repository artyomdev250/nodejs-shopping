const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const User = require("../mongodb/models/User");

const { getAllItems } = require("../controllers/getItemsController");

router.get("/dashboard", auth, async (req, res) => {
    const user = await User.findById(req.user.id).select("name email");

    return res.json({
        message: `Welcome ${user.name}!`,
        user
    });
});

router.get("/items", auth, getAllItems);

module.exports = router;
