require("dotenv").config();
const jwt = require("jsonwebtoken");

const jwtAuthMiddleware = (req, res, next) => {
  
  // first check request headers has authorization or not

  // const authorization = req.headers.authorization;
  if (!req.headers.authorization) return res.status(401).json({ error: "Token Not Found" });

  // Extract the jwt token from the request headers
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user information to the request object
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid token" });
  }
};

//generating token
const generatetoken = (userdata) => {
  return jwt.sign(userdata, process.env.JWT_SECRET, { expiresIn: 30000 });
};

module.exports = { generatetoken, jwtAuthMiddleware };