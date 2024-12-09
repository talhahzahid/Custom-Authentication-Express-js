import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import users from "../models/user.models.js";

// const generateTokenFromUser = (user) => {
//     return jwt.sign({ email: user.email }, process.env.ACCESS_JWT_SECRET, {
//         expiresIn: '1h'
//     })
// }

// const generateAccessToken = (user) => {
//     return jwt.sign({ email: user.email }, process.env.ACCESS_JWT_SECRET, {
//         expiresIn: "6h",
//     });
// };
const generateRefreshToken = (user) => {
    return jwt.sign({ email: user.email }, process.env.REFERESH_JWT_SECRET, {
        expiresIn: "7d",
    });
};


const signUpUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email) return res.status(404).json({ message: "Email is required" })
    if (!password) return res.status(404).json({ message: "Password is required" })
    try {
        const user = await users.findOne({ email })
        if (user) return res.status(400).json({ message: "User is already exit" })
        await users.create({ email, password })
        res.status(200).json({ message: "register successfully " })
    } catch (error) {
        res.status(400).json({ error })
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    console.log("testhing ", email);

    if (!email) return res.status(404).json({ message: "Email is required" })
    if (!password) return res.status(404).json({ message: "Password is required" })
    try {
        const user = await users.findOne({ email })
        if (!user) return res.status(400).json({ message: "No user found" })
        const checkPassword = await bcrypt.compare(password, user.password)
        if (!checkPassword) return res.status(400).json({ message: "Incorrect password" })
        const refreshToken = generateRefreshToken(user)
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: 'None',
        });
        res.json({ message: "Login", data: user, refreshToken })
    } catch (error) {
        res.json({ message: "error" })
    }
}

const checkUser = (req, res) => {
    console.log('hello');
}



export { loginUser, signUpUser, checkUser };
