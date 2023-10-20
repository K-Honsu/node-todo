const crypto = require("crypto")
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


const ForgotPassword = async ({email}) => {
    try {
        const reqBody = { email }
        const user = await UserModel.findOne({email:email})
        if (!user) {
            return {
                code : 404,
                status : "error",
                data : "User not found"
            }
        }
        const token = crypto.randomBytes(20).toString('hex');
        const resetLink = `https://node-todo-5e50.onrender.com/views/resetPassword/${user._id}/${token}`
        const mailerOption = {
            from : "donotreply@gmail.com",
            to : email,
            subject : "Task Manager Password Change",
            text : `You are receiving this mail because you opted in to change your password. Click this link reset your password: ${resetLink}`
        }
        transporter.sendMail(mailerOption, (error, info) => {
            if (error) {
                console.log("Error sending mail", error);
            } else {
                console.log("Email sent", info.response)
            }
        })
        return {
            code : 200,
            status : "success",
            data : "Kindly check your mail for link to reset your password."
        }
    } catch (error) {
        return {
            code : 422,
            status : "error",
            data : error.message
        }
    }
}

const ResetPassword = async ({user_id, newpassword, confirmpassword}) => {
    try {
        const reqBody = { newpassword, confirmpassword}
        const user = await UserModel.findOne({_id : user_id})
        if (!user) {
            return {
                code : 404,
                status : "error",
                data : "User not found"
            }
        }
        if( newpassword != confirmpassword ) {
            return {
                code : 406,
                status : "error",
                data : "Password do no match."
            }
        }
        user.password = newpassword
        await user.save()
        return {
            code : 200,
            status : "success",
            data : "Password updated successfully. Kindly login with your newly created password."
        }
    } catch (error) {
        return {
            codde : 422,
            status : "error",
            data : error.message
        }
    }
}

module.exports = {
    Login,
    createUser,
    ForgotPassword,
    ResetPassword
}