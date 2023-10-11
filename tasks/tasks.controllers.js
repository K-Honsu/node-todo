const TaskModel = require("../models/task")

const createTask = async (req, res) => {
    try {
        const { title, description } = req.body
        const user = req.user
        const task = await TaskModel.create({
            title,
            description,
            user : user._id
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

const getTask = async (req, res) => {
    try {
        const user_id = req.user._id
        console.log({user_id})
        const task = await TaskModel.find({user:user_id})
        console.log({task})
        if (!task) {
            return res.status(404).json({
                status : "error",
                data : "No task for the user"
            })
        }
        return res.status(200).json({
            status : "success",
            data : task
        })
    } catch (error) {
        return res.status(500),json({
            status : "error",
            data : error.message
        })
    }
}

const updateTask = async (req, res) => {
    try {
        const id = req.params.id
        const user_id = req.user._id
        const { title, description } = req.body
        const task = await TaskModel.findOne({ _id: id, user: user_id })
        if (!task) {
            return res.status(404).json({
                status : "error",
                data : `Task not found`
            })
        }
        if (title) {
            task.title = title
        }
        if( description) {
            task.description = description
        }
        await task.save()
        return res.status(200).json({
            status : "success",
            message : "Task Updated Successfully",
            task 
        })
    } catch (error) {
        return res.status(422).json({
            status : "error",
            message : error.message
        })
    }
}

const deleteTask = async (req, res) => {
    try {
        const id = req.params.id
        const user_id = req.user._id
        const task = await TaskModel.findOne({ _id: id, user: user_id })
        if (!task) {
            return res.status(404).json({
                status : "error",
                data : `Task not found`
            })
        }
        await task.deleteOne()
        return res.status(200).json({
            status : "success",
            message : "Task deleted successfully",
        })
    } catch (error) {
        return res.status(400).json({
            status : "error",
            message : error.message
        })
    }
}

module.exports = {
    createTask,
    getTask,
    updateTask,
    deleteTask
}