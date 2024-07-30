const express = require("express");
const router = express.Router();
const { jwtAuthMiddleware } = require("../jwt");
const {
  trackingfood,
  trackingsinglefood,
} = require("../controllers/trackingcontroller");

router.route("/trackingfood").post(jwtAuthMiddleware, trackingfood);
router
  .route("/trackingsinglefood/:userid/:date")
  .get(jwtAuthMiddleware, trackingsinglefood);

module.exports = router;
