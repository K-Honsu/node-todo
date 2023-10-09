const mongoose = require("mongoose")
const schema = mongoose.Schema

const TaskSchema = new schema({
    user_id : {
        type: mongoose.Schema.ObjectId,
        ref : "users"
    },
    title : {type : String, required : true},
    description : {type : String, required: true},
    status : {type : String, enum : ["pending", "completed"], default: "pending"},
    created_at : {type: Date, default : new Date()},
})


const TaskModel = mongoose.model("tasks", TaskSchema)

module.exports = TaskModel