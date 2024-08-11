const mongoose = require("mongoose");
const { Types } = mongoose;
const User = require("../models/userModel");
const { generatetoken } = require("../jwt");
const { use } = require("../routes/userroutes");

//register
const register = async (req, res) => {
  try {
    const data = req.body;

    if (!data.name || !data.email || !data.password || !data.age) {
      res.status(404).json({ error: "enter all the required fields" });
    }

    // Validate if the password is at least 5 characters long
    if (!/^.{5,}$/.test(data.password)) {
      console.log("Invalid Password:", data.password);
      return res
        .status(400)
        .json({ error: "Password must be at least 5 characters long" });
    }

    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const newuser = new User(data);
    const response = await newuser.save();

    res.status(201).json({ response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
};

//login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(401)
        .json({ msg: "please enter all the required fields" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).status({ error: "user not found" });
    }

    if (!(await user.comparepassword(password))) {
      return res.status(401).json({ error: "incorrect password" });
    }

    const payload = {
      id: user.id,
    };

    const token = generatetoken(payload);

    res.status(200).json({ msg: "Login successful", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
};

//updating password
const updatepassword = async (req, res) => {
  try {
    const userId = req.user.id; // Extract the id from the token
    const { currentpassword, newpassword } = req.body;

    // Check if currentPassword and newPassword are present in the request body
    if (!currentpassword || !newpassword) {
      return res
        .status(400)
        .json({ error: "Both currentPassword and newPassword are required" });
    }

    // Find the user by userID
    const user = await User.findById(userId);

    // If user does not exist or password does not match, return error
    if (!user || !(await user.comparepassword(currentpassword))) {
      return res.status(401).json({ error: "Invalid current password" });
    }

    // Update the user's password
    user.password = newpassword;
    await user.save();

    console.log("password updated");
    res.status(200).json({ message: "Password updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//bmi
const updateusermetrics = async (req, res) => {
  const { userId, height, weight } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (height) user.height = height;
    if (weight) user.weight = weight;

    await user.save();

    const bmi = user.calculateBMI();
    const bmiClassification = user.getBMIClassification();
    const recommendedCalorieIntake = user.getRecommendedCalorieIntake();

    res.status(200).json({
      msg: "User metrics updated",
      user: {
        ...user.toObject(),
        BMI: user.BMI,
        bmiClassification: bmiClassification,
        recommendedCalorieIntake: recommendedCalorieIntake,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//calorie intake
const getusermetrics = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const bmi = user.calculateBMI();
    const bmiClassification = user.getBMIClassification();
    const recommendedCalorieIntake = user.getRecommendedCalorieIntake();

    res.status(200).json({
      userId: user._id,
      BMI: user.BMI,
      bmiClassification: bmiClassification,
      recommendedCalorieIntake: recommendedCalorieIntake,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  register,
  login,
  updatepassword,
  updateusermetrics,
  getusermetrics,
};
