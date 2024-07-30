const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// const userSchema = mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//     },
//     height: {
//       type: Number, // in cm
//       required: false,
//     },
//     weight: {
//       type: Number, // in kg
//       required: false,
//     },
//     BMI: {
//       type: Number,
//       required: false,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     age: {
//       type: Number,
//       required: true,
//       min: 12,
//     },
//   },
//   { timestamps: true }
// );

// userSchema.methods.calculateBMI = function () {
//   if (this.height && this.weight) {
//     const heightInMeters = this.height / 100;
//     this.BMI = this.weight / (heightInMeters * heightInMeters);
//   } else {
//     this.BMI = null;
//   }
// };

// userSchema.methods.getRecommendedCalorieIntake = function () {
//   const classification = this.getBMIClassification();
//   switch (classification) {
//     case "Underweight":
//       return 2500; // example value for underweight
//     case "Normal weight":
//       return 2000; // example value for normal weight
//     case "Overweight":
//       return 1800; // example value for overweight
//     case "Obesity":
//       return 1500; // example value for obesity
//     default:
//       return null;
//   }
// };

// userSchema.pre("save", async function (next) {
//   const person = this;

//   if (!person.isModified("password")) {
//     return next();
//   }

//   try {
//     const salt = await bcrypt.genSalt();
//     const hashedpassword = await bcrypt.hash(person.password, salt);

//     person.password = hashedpassword;
//     next();
//   } catch (error) {
//     return next(error);
//   }
// });

// userSchema.methods.comparepassword = async function (userpassword) {
//   try {
//     const ismatch = await bcrypt.compare(userpassword, this.password);
//     return ismatch;
//   } catch (error) {
//     throw error;
//   }
// };

// const userModel = mongoose.model("users", userSchema);
// module.exports = userModel;

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    height: {
      type: Number, // in cm
      required: false,
    },
    weight: {
      type: Number, // in kg
      required: false,
    },
    BMI: {
      type: Number,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: 12,
    },
  },
  { timestamps: true }
);

userSchema.methods.calculateBMI = function () {
  if (this.height && this.weight) {
    const heightInMeters = this.height / 100;
    this.BMI = this.weight / (heightInMeters * heightInMeters);
  } else {
    this.BMI = null;
  }
};

userSchema.methods.getBMIClassification = function () {
  if (this.BMI === null) {
    return null;
  } else if (this.BMI < 18.5) {
    return "Underweight";
  } else if (this.BMI >= 18.5 && this.BMI < 24.9) {
    return "Normal weight";
  } else if (this.BMI >= 25 && this.BMI < 29.9) {
    return "Overweight";
  } else {
    return "Obesity";
  }
};

userSchema.methods.getRecommendedCalorieIntake = function () {
  const classification = this.getBMIClassification();
  switch (classification) {
    case "Underweight":
      return 2500; // example value for underweight
    case "Normal weight":
      return 2000; // example value for normal weight
    case "Overweight":
      return 1800; // example value for overweight
    case "Obesity":
      return 1500; // example value for obesity
    default:
      return null;
  }
};

userSchema.pre("save", async function (next) {
  const person = this;

  if (!person.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt();
    const hashedpassword = await bcrypt.hash(person.password, salt);

    person.password = hashedpassword;
    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.comparepassword = async function (userpassword) {
  try {
    const ismatch = await bcrypt.compare(userpassword, this.password);
    return ismatch;
  } catch (error) {
    throw error;
  }
};

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
