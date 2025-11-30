const BlacklistedToken = require("../../mongodb/models/BlacklistedToken");

const isProd = process.env.NODE_ENV === "production";

exports.logout = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;

        if (!token) {
            return res.status(200).json({ message: "Logged out" });
        }

        // Add token to blacklist
        await BlacklistedToken.create({
            token,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        // Clear cookie
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            path: "/",
        });

        return res.status(200).json({ message: "Logout successful" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};
