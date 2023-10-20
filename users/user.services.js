const UserModel = require("../models/user")
const jwt = require("jsonwebtoken")
const transporter = require("../mailer")
require("dotenv").config()

const Login = async ({username, password}) => {
    try {
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
    } catch (error) {
        return {
            status : "error",
            code : 422,
            data : error.message
        }
    }

}

const createUser = async ({email, username, password}) => {
    try {
        const reqBody = {email, username, password}
        const existingUser = await UserModel.findOne({
            email : email
        })
        if(existingUser){
            return {
                code : 422,
                status : "error",
                data : "User already exist"
            }
        }
        if (password === username ) {
            return {
                status : error,
                code : 400,
                data : "Username and password cannot be the same"
            }
        }
        const user = await UserModel.create({
            username,
            email,
            password
        })

        const mailerOption = {
            from : "donotreply@gmail.com",
            to : email,
            subject : "Welcome to Task Manager app",
            text : `Dear ${user.username}\nThank you for creating an account with us. \n We are very glad to have you here!. We do hope you enjoy our service. \n Thank you.`
        }

        transporter.sendMail(mailerOption, (error, info) => {
            if (error) {
                console.log("Error sending mail", error);
            } else {
                console.log("Email sent", info.response)
            }
        })
        return {
            status : "success",
            code : 201,
            message : "User created successfully",
            data : user
        }
    } catch (error) {
        return {
            status : "error",
            code : 422,
            data : error.message
        }
    }
}

module.exports = {
    Login,
    createUser
}