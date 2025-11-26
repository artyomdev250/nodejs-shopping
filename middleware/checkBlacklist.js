const BlacklistedToken = require("../mongodb/models/BlacklistedToken");

module.exports = async (req, res, next) => {
    const token = req.cookies.refreshToken;

    if (!token) return res.status(401).json({ message: "Refresh token missing" });

    const isBlacklisted = await BlacklistedToken.findOne({ token });

    if (isBlacklisted) {
        return res.status(401).json({ message: "Token is blacklisted, please login again" });
    }

    next();
};
