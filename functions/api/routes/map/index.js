const { Router } = require("express");

const router = Router();

router.post("/", require("./mapPOST.js"));
router.get("/search", require("./mapSearchGET.js"));

module.exports = router;
