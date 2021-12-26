const { Router } = require("express");

const router = Router();

router.post("/", require("./mapPOST.js"));

module.exports = router;
