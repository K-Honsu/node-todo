const express = require('express')
const userRouter = require("./users/user.routers")
const authRouter = require("./auth/auth.routers")
const taskRouter = require("./tasks/tasks.routers")

const app = express()


app.use(express.json())
app.use("/user", userRouter)
app.use("/auth", authRouter)
app.use("/task", taskRouter)

app.get('*', (req, res) => {
    return res.status(404).json({
        data: null,
        error: 'route not found'
    })
})

module.exports = app