const express = require("express");
const router = express.Router();

const { jwtAuthMiddleware } = require("../jwt");

const {
  register,
  login,
  updatepassword,
  updateusermetrics,
  getusermetrics,
} = require("../controllers/usercontroller");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/updatepassword").put(jwtAuthMiddleware, updatepassword);
// router.route("/finduser").get(jwtAuthMiddleware, finduser);
router.route("/update-metrics").get(jwtAuthMiddleware, updateusermetrics);
router.route("/metrics/:userId").get(jwtAuthMiddleware, getusermetrics);

module.exports = router;
