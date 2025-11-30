const User = require('../../mongodb/models/User');
const jwt = require('jsonwebtoken');

const isProd = process.env.NODE_ENV === "production";

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (password !== user.password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const accessToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        );

        const refreshToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProd,              // true on Vercel (https), false in local server dev
            sameSite: isProd ? "none" : "lax",
            path: "/",
        });

        return res.json({
            message: "Login successful",
            accessToken
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
