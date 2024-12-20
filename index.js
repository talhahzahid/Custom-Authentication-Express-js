import dotenv from "dotenv"
dotenv.config()
import express from "express"
const app = express()
const port = process.env.PORT
import cors from "cors";


import connectdb from "./src/db/index.js"
import router from "./src/routes/user.route.js"
import cookieParser from "cookie-parser"

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.get('/', (req, res) => {
    res.send('Talha')
})


app.use('/user', router)




connectdb()
    .then(() => {
        app.listen(port, () => {
            console.log("server Is Running At Port", port);
        })
    })
    .catch((err) => {
        console.log(err);
    })