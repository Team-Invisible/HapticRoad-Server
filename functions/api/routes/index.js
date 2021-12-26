const express = require("express");
const router = express.Router();

router.use("/map", require("./map"));

module.exports = router;
