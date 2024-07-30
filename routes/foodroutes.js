const express = require("express");
const router = express.Router();
const {
  addfood,
  showfood,
  searchfood,
} = require("../controllers/foodcontroller");

const { jwtAuthMiddleware } = require("../jwt");

router.route("/addfood").post(jwtAuthMiddleware, addfood);
router.route("/showfood").get(jwtAuthMiddleware, showfood);
router.route("/searchfood/:name").get(jwtAuthMiddleware, searchfood);

module.exports = router;
