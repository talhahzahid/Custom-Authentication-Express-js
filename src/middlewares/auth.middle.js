// import jwt from "jsonwebtoken";

// const authenticateUser = async (req, res, next) => {
//   const token = req.headers["authorization"];
//   if (!token) return res.status(404).json({ message: "no token found" });

//   jwt.verify(token, process.env.ACCESS_JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ message: "invalid token" });
//     req.user = user;
//     next();
//   });
// };

// export default authenticateUser;




// import jwt from "jsonwebtoken";
// import cookieParser from "cookie-parser"; // Make sure to install cookie-parser

// const authenticateUser = async (req, res, next) => {
//   // Use cookie-parser to get the token from cookies
//   const token = req.cookies["authToken"]; // Replace with your actual cookie name

//   if (!token) return res.status(404).json({ message: "No token found" });

//   jwt.verify(token, process.env.ACCESS_JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ message: "Invalid token" });
//     req.user = user;
//     next();
//   });
// };


// export default authenticateUser;

import jwt from 'jsonwebtoken';
const checkUser = (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }
  jwt.verify(token, process.env.REFERESH_JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    res.json({
      message: "User authenticated",
      user: req.user,
      token
    });
  });
};

export default checkUser;
