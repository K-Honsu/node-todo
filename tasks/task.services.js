const TaskModel = require("../models/task")

const createTask = async (task, user_id) => {
    try {
        const taskbody = task
        console.log({taskbody});
        const newTask = new TaskModel()
        console.log({newTask});
        newTask.title = taskbody.title
        newTask.description = taskbody.description
        console.log(newTask.title)
        console.log(taskbody.title)
        const save = await newTask.save()
        return {
            status : "success",
            code : 201,
            message : "Task Created Successfully",
            data : save
        }
    } catch (error) {
        return {
            status : "error",
            code : 422,
            data : error.message
        }
    }
}

const getTask = async () => {
    try {
        const tasks = await TaskModel.find({});
        if (!tasks || tasks.length === 0) {
            return {
                status: "error",
                data: "No task for the user",
            };
        }
        return {
            status: "success",
            data: tasks,
        };
    } catch (error) {
        return {
            status: "error",
            data: error.message,
        };
    }
};


module.exports = {
    getTask,
    createTask
}