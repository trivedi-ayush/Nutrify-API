const { json } = require("express");
const Food = require("../models/foodModel");

const addfood = async (req, res) => {
  try {
    const data = req.body;
    if (
      !data.name ||
      !data.calories ||
      !data.protein ||
      !data.fat ||
      !data.fiber ||
      !data.carbohydrates
    ) {
      console.log("Missing required fields:", data);
      return res
        .status(400)
        .json({ error: "Please enter all the required fields" });
    }

    if (
      data.calories <= 0 ||
      data.protein <= 0 ||
      data.fat <= 0 ||
      data.fiber <= 0 ||
      data.carbohydrates <= 0
    ) {
      return res
        .status(400)
        .json({ error: "Macros must  be a positive number" });
    }

    // Check if the food item already exists
    const existingFood = await Food.findOne({ name: data.name });
    if (existingFood) {
      return res.status(409).json({ error: "Food already exists" });
    }

    const newfood = new Food(data);
    const response = await newfood.save();

    res.status(201).json({ msg: "new food added", response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
};

const showfood = async (req, res) => {
  try {
    const food = await Food.find();

    if (!food) {
      return res.status(400).json({ error: "food not found" });
    }

    res.status(200).json({ food });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
};

const searchfood = async (req, res) => {
  try {
    const food = await Food.find({
      name: { $regex: req.params.name, $options: "i" },
    });
    if (!food) {
      return res.status(400).json({ error: "food not found" });
    }

    res.status(200).json({ food });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
};

module.exports = { addfood, showfood, searchfood };
