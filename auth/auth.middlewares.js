const joi = require("joi")

const validateLogin = async (req, res, next) => {
    try {
        const schema = joi.object({
            username : joi.string().required(),
            password : joi.string().required()
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
    validateLogin
}