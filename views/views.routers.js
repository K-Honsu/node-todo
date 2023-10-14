const express = require("express")
const userServices = require("../users/user.services")

const router = express.Router()

// router.get("/", (req, res) => {
//     res.render("index")
// })

router.post("/login", async (req, res) => {
    const response = await userServices.Login({
        username: req.body.username,
        password: req.body.password,
    });
    if (response.code === 200) {
        res.redirect("home");
    } else {
        res.render("index")
    }
});

router.get("/home", (req, res) => {
    return res.render("home")
})

module.exports = router