const express = require("express");
const router = express.Router();
const usercontroller = require("../controllers/user");
router.get("/", usercontroller.defaultroute);
router.post("/getotp", usercontroller.getotp);
router.post("/updateisverified", usercontroller.updateisverified);
router.post("/resendotp", usercontroller.resendotp);
module.exports = router;
