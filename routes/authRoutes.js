const express = require("express");
const router = express.Router();

const { signup } = require("../controllers/signUpController");
const { signin } = require("../controllers/signInController");
const { refresh } = require("../controllers/refreshTokenController");
const { logout } = require("../controllers/signOutController");

const checkBlacklist = require("../middleware/checkBlacklist");

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/refresh", checkBlacklist, refresh);
router.post("/signout", logout);

module.exports = router;
