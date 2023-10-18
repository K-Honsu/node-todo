const express = require("express")
const userServices = require("../users/user.services")
const TaskServices = require("../tasks/task.services")
const cookieParser = require("cookie-parser")
const methodOverride = require('method-override')

const jwt = require("jsonwebtoken")
require("dotenv").config()

const router = express.Router()

router.use(cookieParser())
router.use(methodOverride("_method"))


router.get("/start", (req, res) => {
    res.render("partials/welcome")
})

router.get("/index", (req, res) => {
    res.render("index", { user: res.locals.user || null })
})

router.post("/login", async (req, res) => {
    const response = await userServices.Login({
        username: req.body.username,
        password: req.body.password,
    });
    if (response.code === 200) {
        res.cookie("jwt", response.data.token, { maxAge: 360000 })
        res.redirect("home");
    } else {
        res.render("index")
    }
});

router.use(async (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        try {
            const decodedValue = await jwt.verify(token, process.env.JWT_SECRET)
            res.locals.user = decodedValue
            next()
        } catch (error) {
            res.redirect("index")
        }
    } else {
        res.redirect("index")
    }
})

router.get("/logout", (req, res) => {
    res.clearCookie("jwt")
    res.redirect("start")
})

router.put("/task/:taskId", async (req, res) => {
    const user_id = res.locals.user._id;
    const taskId = req.params.taskId;
    const response = await TaskServices.updateTaskStatus(taskId, user_id);
    console.log({response})

    if (response.code === 200) {
        res.redirect("/views/home");
    } else {
        res.render("home", { error: response.data })
    }
});


router.get("/home", async (req, res) => {
    const response = await TaskServices.getTask()
    return res.render("home", { user: res.locals.user, tasks: response.data })
})

router.get("/task", (req, res) => {
    res.render("task", { user: res.locals.user })
})

router.post("/task", async (req, res) => {
    const user_id = res.locals.user._id
    const response = await TaskServices.createTask(req.body, user_id)
    if (response.code === 201) {
        res.redirect("home")
    } else {
        res.render("task", { error: response.data })
    }
})

router.get("/completedTask", async (req, res) => {
    const response = await TaskServices.getTask()
    return res.render("completedTask",  { user: res.locals.user, tasks: response.data })
})

// router.patch("/task/:taskId", async (req, res) => {
//     try {
//     const user_id = res.locals.user._id;
//     console.log(user_id)
//     const taskId = req.params.taskId;
//     console.log(taskId)
//     const response = await TaskServices.updateTaskStatus(taskId, user_id);
//     console.log({ response })
//     } catch (error) {
//         console.log(error)
//     }
// })



module.exports = router