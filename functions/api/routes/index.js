const express = require("express");
const router = express.Router();

router.use("/user", require("./user"));
router.use("/map", require("./map"));

module.exports = router;
