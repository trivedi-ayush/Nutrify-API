require("dotenv").config;

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

//for parsing
app.use(express.json()); // Middleware for parsing JSON bodies
app.use(express.urlencoded({ extended: true })); //url encoded parsing

//importing routes
const userroutes = require("./routes/userroutes");
const foodroutes = require("./routes/foodroutes");
const trackingroutes = require("./routes/trackingroutes");

//routes
app.use("/user", userroutes);
app.use("/food", foodroutes);
app.use("/tracking", trackingroutes);

//db  connection
const PORT = process.env.PORT || 5005;
mongoose
  .connect("mongodb://localhost:27017/NUTRIFY")
  .then(
    console.log("DB connection successful"),
    app.listen(PORT, () => {
      console.log(`server is running on ${PORT}`);
    })
  )
  .catch((err) => {
    console.log(err);
  });
