const { default: mongoose } = require("mongoose");
const trackingModel = require("../models/trackingModel");

const trackingfood = async (req, res) => {
  const trackdata = req.body;
  if (!trackdata.userId || !trackdata.foodId || !trackdata.quantity) {
    return res.status(401).json({ error: "enter all the required fields" });
  }
  try {
    const newfood = new trackingModel(trackdata);
    const response = await newfood.save();

    if (!response) {
      return res.status(400).json({ error: "data not found" });
    }
    console.log(response);
    res.status(201).json({ msg: "food added", response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
};

//food eaten by a person

const trackingsinglefood = async (req, res) => {
  const userid = req.params.userid;
  const date = new Date(req.params.date);
  const strdate =
    (date.getMonth() + 1).toString().padStart(2, "0") +
    "/" +
    date.getDate().toString().padStart(2, "0") +
    "/" +
    date.getFullYear();

  const altStrdate =
    date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();

  console.log("Formatted Date:", strdate);
  console.log("Alternate Formatted Date:", altStrdate);
  console.log("User ID:", userid);

  try {
    const foods = await trackingModel
      .find({
        userId: userid,
        $or: [{ eatenDate: strdate }, { eatenDate: altStrdate }],
      })
      .populate("userId")
      .populate("foodId");

    console.log(foods);

    if (!foods || foods.length === 0) {
      return res.status(404).json({ error: "not found" });
    }

    // Initialize totals
    let totalCalories = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalFiber = 0;
    let totalCarbohydrates = 0;

    foods.forEach((food) => {
      const details = food.details || {}; // Use empty object if details is undefined

      console.log("Processing Food:", details, food.quantity);

      totalCalories += (details.calories || 0) * (food.quantity / 100 || 0);
      totalProtein += (details.protein || 0) * (food.quantity / 100 || 0);
      totalFat += (details.fat || 0) * (food.quantity / 100 || 0);
      totalFiber += (details.fiber || 0) * (food.quantity / 100 || 0);
      totalCarbohydrates +=
        (details.carbohydrates || 0) * (food.quantity / 100 || 0);
    });

    console.log("Total Intake:", {
      totalCalories,
      totalProtein,
      totalFat,
      totalFiber,
      totalCarbohydrates,
    });

    res.status(200).json({
      totalCalories,
      totalProtein,
      totalFat,
      totalFiber,
      totalCarbohydrates,
    });

    // res.status(200).json({ foods });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
};

module.exports = { trackingfood, trackingsinglefood };
