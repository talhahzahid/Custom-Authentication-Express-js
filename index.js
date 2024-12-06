import dotenv from "dotenv"
dotenv.config()
import express from "express"
const app = express()
const port = process.env.PORT   

app.get('/', (req, res) => {
    res.send('Talha')
})


app.listen(port, () => {
    console.log("server Is Running At Port", port);
})