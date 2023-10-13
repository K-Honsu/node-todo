const express = require("express")
const controller = require("./auth.controllers")
const middleware = require("./auth.middlewares")

const router = express.Router()

router.post("/login", middleware.validateLogin, controller.Login)
router.post("/forgot-password", controller.ForgotPassword)
router.post("/reset-password/:id", middleware.validatePassword, controller.ResetPassword)

module.exports = router