const express = require("express");
const router = express.Router();

const { signup } = require("../controllers/signUpController");
const { signin } = require("../controllers/signInController");

router.post("/signup", signup);
router.post("/signin", signin);

module.exports = router;
