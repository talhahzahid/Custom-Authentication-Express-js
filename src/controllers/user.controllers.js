// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import users from "../models/user.models.js";

// // const generateTokenFromUser = (user) => {
// //     return jwt.sign({ email: user.email }, process.env.ACCESS_JWT_SECRET, {
// //         expiresIn: '1h'
// //     })
// // }

// // const generateAccessToken = (user) => {
// //     return jwt.sign({ email: user.email }, process.env.ACCESS_JWT_SECRET, {
// //         expiresIn: "6h",
// //     });
// // };
// const generateRefreshToken = (user) => {
//     return jwt.sign({ email: user.email }, process.env.REFERESH_JWT_SECRET, {
//         expiresIn: "7d",
//     });
// };


// const signUpUser = async (req, res) => {
//     const { email, password } = req.body;
//     if (!email) return res.status(404).json({ message: "Email is required" })
//     if (!password) return res.status(404).json({ message: "Password is required" })
//     try {
//         const user = await users.findOne({ email })
//         if (user) return res.status(400).json({ message: "User is already exit" })
//         await users.create({ email, password })
//         res.status(200).json({ message: "register successfully " })
//     } catch (error) {
//         res.status(400).json({ error })
//     }
// }

// const loginUser = async (req, res) => {
//     const { email, password } = req.body;

//     console.log("testhing ", email);

//     if (!email) return res.status(404).json({ message: "Email is required" })
//     if (!password) return res.status(404).json({ message: "Password is required" })
//     try {
//         const user = await users.findOne({ email })
//         if (!user) return res.status(400).json({ message: "No user found" })
//         const checkPassword = await bcrypt.compare(password, user.password)
//         if (!checkPassword) return res.status(400).json({ message: "Incorrect password" })
//         const refreshToken = generateRefreshToken(user)
//         res.cookie("refreshToken", refreshToken, {
//             httpOnly: true,
//             sameSite: 'None',
//         });
//         res.json({ message: "Login", data: user, refreshToken })
//     } catch (error) {
//         res.json({ message: "error" })
//     }
// }






// export { loginUser, signUpUser };


import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import users from "../models/user.models.js";

// Generate Access Token (Short-lived)
const generateAccessToken = (user) => {
    return jwt.sign({ email: user.email }, process.env.ACCESS_JWT_SECRET, {
        expiresIn: "1h", // Access token expires in 1 hour
    });
};

// Generate Refresh Token (Long-lived)
const generateRefreshToken = (user) => {
    return jwt.sign({ email: user.email }, process.env.REFERESH_JWT_SECRET, {
        expiresIn: "7d", // Refresh token expires in 7 days
    });
};

const signUpUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });
    if (!password) return res.status(400).json({ message: "Password is required" });

    try {
        const existingUser = await users.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the user with the hashed password
        await users.create({ email, password: hashedPassword });

        res.status(200).json({ message: "Registration successful" });
    } catch (error) {
        console.error("Error during sign-up:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });
    if (!password) return res.status(400).json({ message: "Password is required" });

    try {
        const user = await users.findOne({ email });
        if (!user) return res.status(400).json({ message: "No user found with this email" });

        // Compare the provided password with the hashed password in the database
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) return res.status(400).json({ message: "Incorrect password" });

        // Generate Access and Refresh Tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Set the refresh token in the cookie (HTTP-only, secure)
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,// process.env.NODE_ENV === "production", // Ensure secure cookie in production
            sameSite: "None", // Necessary for cross-site cookies
            maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires in 7 days
        });

        // Respond with the user data and access token
        res.json({
            message: "Login successful",
            data: user,
            accessToken, // Include the access token in the response
            refreshToken, // Optionally, include the refresh token as well (usually not necessary)
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};





export { loginUser, signUpUser };
