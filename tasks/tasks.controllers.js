const TaskModel = require("../models/task")

const createTask = async (req, res) => {
    try {
        const { user_id, title, description } = req.body
        const task = await TaskModel.create({
            user_id,
            title,
            description
        })
        return res.status(201).json({
            status : "success",
            data : task
        })
    } catch (error) {
        return res.status(400).json({
            status : "error",
            data : error.message
        })
    }
}

module.exports = {
    createTask
}