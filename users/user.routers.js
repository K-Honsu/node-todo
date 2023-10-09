const express = require("express")
const controller = require("./user.controllers")
const middleware = require("./user.middlewares")

const router = express.Router()

router.post("/signup", middleware.validateUser, controller.createUser)
router.get("/:id", middleware.validateId, controller.getUser)
router.patch("/update/:id", controller.updateUserInfo)

module.exports = router