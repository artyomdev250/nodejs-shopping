const Item = require("../mongodb/models/Item");

exports.getAllItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json({ items });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch items" });
    }
};
