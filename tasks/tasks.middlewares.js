const UserModel = require("../models/user")
const mongoose = require("mongoose")
const joi = require("joi")

const validateUserId = async (req, res, next) => {
    try {
        const { user_id } = req.body
        const user = await UserModel.findById(user_id)
        if (!user) {
            return res.status(404).json({
                status : "error",
                data : "No user found with id"
            })
        }
        next()
    } catch (error) {
        return res.status(422).json({
            status : "error",
            data : error.message
        })
    }
}

const validateTask = async (req, res, next) => {
    try {
        const { user_id } = req.body;
        if (!mongoose.isValidObjectId(user_id)){
            return res.status(422).json({
                status : "error",
                data : "Invalid user_id format"
            })
        }
        const schema = await joi.object({
            user_id : joi.string().required(),
            title : joi.string().required(),
            description : joi.string().required(),
        })
        await schema.validateAsync(req.body, {abortEarly : true})
        next()
    } catch (error) {
        return res.status(422).json({
            status : "error",
            data : error.message
        })
    }
}

module.exports = {
    validateUserId,
    validateTask
}