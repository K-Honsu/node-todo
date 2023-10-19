const express = require('express')
const userRouter = require("./users/user.routers")
const authRouter = require("./auth/auth.routers")
const TaskServices = require("./tasks/task.services")
const taskRouter = require("./tasks/tasks.routers")
const viewRouter = require("./views/views.routers")
const methodOverride = require('method-override')
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")



const app = express()


app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.static("views"))
app.use(express.urlencoded({ extended : true }))
app.use(methodOverride("_method"))



app.use("/user", userRouter)
app.use("/auth", authRouter)
app.use("/task", taskRouter)
app.use("/views", viewRouter)

app.get('*', (req, res) => {
    return res.status(404).json({
        data: null,
        error: 'route not found'
    })
})

app.use(cookieParser())


// app.use(async (req, res, next) => {
//     const token = req.cookies.jwt;
//     console.log({token})

//     if (token) {
//         try {
//             res.locals.user = token
//             next()
//         } catch (error) {
//             // console.log({error})
//             res.redirect("http://localhost:3005/views/home")
//         }
//     } else {
//         res.redirect("home")
//     }
// })

// app.use(async (req, res, next) => {
//     const token = req.cookies.jwt;
//     console.log({token})

//     if (token) {
//         try {
//             const decodedValue = await jwt.verify(token, process.env.JWT_SECRET)
//             res.locals.user = decodedValue
//             next()
//         } catch (error) {
//             res.redirect("index")
//         }
//     } else {
//         res.redirect("index")
//     }
// })


// app.post("/callback", async (req, res) => {
//     const token = req.body.id_token
//     res.cookie("jwt", token)
//     const tokenValue = req.cookies.jwt
//     console.log(tokenValue)
//     if (tokenValue) {
//         res.locals.user = tokenValue
//         console.log('hi')
//         console.log(res.locals.user)
//         res.redirect("http://localhost:3005/home")
//     } else {

//         res.redirect("http://localhost:3005/views/home")
//     }
// })

app.post("/callback", async (req, res) => {
    const token = req.body.id_token;

    try {
        // Verify the token
        const decodedValue = token
        res.locals.user = decodedValue;
        res.cookie("jwt", token);
        console.log('Token verification successful');
        console.log(res.locals.user);

        // If token is verified, redirect to "home" page
        const response = await TaskServices.getTask()
        return res.render("home", {tasks :response.data});
    } catch (error) {
        console.error('Token verification failed:', error);

        // If token is not valid, redirect to "home" page as defined in your else condition
        res.redirect("http://localhost:3005/views/home");
    }
});



app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
        data: null,
        error: 'Server Error'
    })
})


module.exports = app