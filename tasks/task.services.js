const TaskModel = require("../models/task")

const createTask = async (task, user_id) => {
    try {
        const taskbody = task
        const newTask = new TaskModel()
        newTask.title = taskbody.title
        newTask.description = taskbody.description
        newTask.user = user_id
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

const updateTaskStatus = async (taskId, user_id) => {
    try {
        const updatedTask = await TaskModel.findByIdAndUpdate(
            {_id : taskId},
            { status: 'completed' },
        );

        if (!updatedTask) {
            return {
                status: 'error',
                code: 404,
                data: 'Task not found',
            };
        }

        return {
            status: 'success',
            code: 200,
            message: 'Task status updated to completed',
            data: updatedTask,
        };
    } catch (error) {
        console.error(error)
        return {
            status: 'error',
            code: 500,
            data: error.message,
        };
    }
};



module.exports = {
    getTask,
    createTask,
    updateTaskStatus
}