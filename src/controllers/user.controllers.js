import mongoose from "mongoose";
import users from "../models/user.models.js"
import bcrypt from "bcrypt"

const signInUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email) return res.status(404).json({ message: "Email is required" })
    if (!password) return res.status(404).json({ message: "Password is required" })
    try {
        const user = await users.findOne({ email })
        if (user) return res.status(400).json({ message: "User is already exit" })
        const register = await users.create({ email, password })
        res.status(200).json({ message: "register successfully " })
    } catch (error) {
        res.status(400).json({ error })
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email) return res.status(404).json({ message: "Email is required" })
    if (!password) return res.status(404).json({ message: "Password is required" })
    try {
        const user = await users.findOne({ email })
        if (!user) return res.status(400).json({ message: "No user found" })
        const checkPassword = await bcrypt.compare(password, user.password)
        if (!checkPassword) return res.status(400).json({ message: "Incorrect password" })
        res.json({ message: "Login" })
    } catch (error) {
        res.json({ message: "error" })
    }

}

export { signInUser, loginUser }