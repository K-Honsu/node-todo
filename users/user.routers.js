const express = require("express")
const controller = require("./user.controllers")
const middleware = require("./user.middlewares")
const globalMiddleware = require("../middleware/global.middleware")

const router = express.Router()

router.post("/signup", middleware.validateUser, middleware.validateUsername, controller.createUser)
router.get("/", globalMiddleware.BearerToken, controller.getUser)
router.patch("/update", globalMiddleware.BearerToken, controller.updateUserInfo)

module.exports = router