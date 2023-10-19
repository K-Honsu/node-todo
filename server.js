const app = require("./main")
const express = require("express")
const config = require("./config/mongoose")
const authomiddleware = require("./auth-service/auth")
const { requireAuth } = require("express-openid-connect")
require("dotenv").config()


const port = process.env.PORT
const appp = express()

appp.use(authomiddleware)

// app.use(express.)

app.get("/callback", (req, res) => {
    console.log(req.oidc.user);
})



config.connect()

app.listen(port, () => console.log(`listening on port: ${port}`))