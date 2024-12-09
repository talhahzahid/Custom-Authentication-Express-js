import express from "express"
import { loginUser, signUpUser, checkUser } from "../controllers/user.controllers.js"
import authenticateUser from "../middlewares/auth.middle.js"

const router = express.Router()

router.post('/signup', signUpUser)
router.post('/signin', loginUser)
router.get("/checkUser", authenticateUser, checkUser,)

export default router