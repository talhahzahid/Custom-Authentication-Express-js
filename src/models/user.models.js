import mongoose from "mongoose";
import bcrypt from "bcrypt"


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
}, { timestamps: true })


userSchema.pre("save", async function (next) {
    const user = this;
    if (!user.isModified("password")) return next()
    const hashPassword = await bcrypt.hash(user.password, 10)
    user.password = hashPassword
})

export default mongoose.model("users", userSchema)