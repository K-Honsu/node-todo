const express = require("express")
const controller = require("./tasks.controllers")
const middleware = require("./tasks.middlewares")

const router = express.Router()

router.post("/create", middleware.validateUserId, middleware.validateTask, controller.createTask)

module.exports = router