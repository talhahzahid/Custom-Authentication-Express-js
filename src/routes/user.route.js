import express from "express"
import { loginUser, signInUser } from "../controllers/user.controllers.js"

const router = express.Router()

router.post('/signin', signInUser)
router.post('/signup', loginUser)

export default router