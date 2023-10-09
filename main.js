const express = require('express')
const config = require("./config/mongoose")
const userRouter = require("./users/user.routers")
const authRouter = require("./auth/auth.routers")
const taskRouter = require("./tasks/tasks.routers")

const port = 3005
const app = express()
config.connect()

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

app.listen(port, () => console.log(`listening on port: ${port}`))