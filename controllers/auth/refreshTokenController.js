const jwt = require("jsonwebtoken");

exports.refresh = (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token) {
        return res.status(401).json({ message: "Refresh token missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        const newAccessToken = jwt.sign(
            { id: decoded.id, email: decoded.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        );

        return res.json({ accessToken: newAccessToken });

    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired refresh token" });
    }
};
