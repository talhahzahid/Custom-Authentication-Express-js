import express from "express"
import { loginUser, signUpUser } from "../controllers/user.controllers.js"
import checkUser from "../middlewares/auth.middle.js"

const router = express.Router()

router.post('/signup', signUpUser)
router.post('/signin', loginUser)
router.get("/protected", checkUser, (req, res) => {
    res.json({ message: "Welcome to the protected route", user: req.user });
  });
  

export default router