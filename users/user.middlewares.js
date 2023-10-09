const joi = require("joi")
const UserModel = require("../models/user")

const validateUser = async (req, res, next) => {
    try {
        const schema = joi.object({
            first_name : joi.string().required(),
            last_name : joi.string().required(),
            email : joi.string().email().required(),
            username : joi.string().required(),
            gender : joi.string().valid("male", "female"),
            password : joi.string().required()
        })
        await schema.validateAsync(req.body, {abortEarly : true})
        next()
    } catch (error) {
        return res.status(422).json({
            status : "error",
            message : error.message
        })
    }
}

const validateId = async (req, res, next) => {
    try {
        const id = req.params.id
        const user = await UserModel.findById(id)
        if (!user) {
            return res.status(400).json({
                status : "error",
                message : `User with ${id} not found`
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

module.exports = {
    validateUser,
    validateId
}