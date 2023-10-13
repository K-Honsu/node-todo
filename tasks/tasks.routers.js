const express = require("express")
const controller = require("./tasks.controllers")
const globalMiddleware = require("../middleware/global.middleware")
const middleware = require("./tasks.middlewares")

const router = express.Router()

router.post("/create", globalMiddleware.BearerToken, middleware.validateUserId, middleware.validateTask, controller.createTask)
router.get("/", globalMiddleware.BearerToken, controller.getTask)
router.get("/:id", globalMiddleware.BearerToken, controller.getOneTask)
router.patch("/update/:id", globalMiddleware.BearerToken, controller.updateTask)
router.delete("/delete/:id", globalMiddleware.BearerToken, controller.deleteTask)

module.exports = router