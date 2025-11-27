const express = require("express");
const router = express.Router();

const { signup } = require("../controllers/auth/signUpController");
const { signin } = require("../controllers/auth/signInController");
const { refresh } = require("../controllers/auth/refreshTokenController");
const { logout } = require("../controllers/auth/signOutController");

const checkBlacklist = require("../middleware/checkBlacklist");

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/refresh", checkBlacklist, refresh);
router.post("/signout", logout);

module.exports = router;
