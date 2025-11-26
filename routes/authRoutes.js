const express = require("express");
const router = express.Router();

const { signup } = require("../controllers/signUpController");
const { signin } = require("../controllers/signInController");
const { refresh } = require("../controllers/refreshTokenController");

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/refresh", refresh);

module.exports = router;
