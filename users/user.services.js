const UserModel = require("../models/user")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Login = async ({username, password}) => {
    const reqBody = {username, password}
    const user = await UserModel.findOne({
        username : reqBody.username
    })
    if (!user) {
        return {
            status : "error",
            data : "User not found",
            code : 404
        }
    }
    const validPassword = await user.IsValidPassword(password)
        if (!validPassword) {
            return {
                status : "error",
                data : "Username or Password is incorrect"
            }
        }
        const token = jwt.sign({email : user.email, _id : user._id}, process.env.JWT_SECRET, {expiresIn : "1hr"})
        return {
            status : "success",
            code : 200,
            data : {
                user,
                token
            }
        }
}

module.exports = {
    Login
}