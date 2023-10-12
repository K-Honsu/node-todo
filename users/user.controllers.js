const UserModel = require("../models/user")
const transporter = require("../mailer")

const createUser = async (req, res) => {
    try {
        const {first_name, last_name, email, username, gender, password} = req.body
        const existingUser = await UserModel.findOne({
            email : email
        })
        if(existingUser){
            return res.status(422).json({
                status : "error",
                message : "User already exist"
            })
        }
        const user = await UserModel.create({
            first_name,
            last_name,
            username,
            email,
            gender,
            password
        })

        const mailerOption = {
            from : "donotreply@gmail.com",
            to : email,
            subject : "Welcome to Task Manager app",
            text : "Thank you for creating an account with us. We are very glad to have you here!. We do hope you enjoy our service. Thank you."
        }

        transporter.sendMail(mailerOption, (error, info) => {
            if (error) {
                console.log("Error sending mail", error);
            } else {
                console.log("Email sent", info.response)
            }
        })
        return res.status(201).json({
            status : "success",
            message : "User created successfully",
            data : user
        })
    } catch (error) {
        return res.status(422).json({
            status : "error",
            message : error.message
        })
    }
}

const getUser = async (req, res) => {
    try {
        const id = req.params.id
        const user = await UserModel.findById(id)
        return res.status(200).json({
            status : "success",
            data : user
        })
    } catch (error) {
        return res.status(422).json({
            status : "error",
            message : error.message
        })
    }
}

const updateUserInfo = async (req, res) => {
    try {
        const id = req.params.id
        const {first_name, last_name, gender, username} = req.body
        const user = await UserModel.findById(id)
        if (!user) {
            return res.status(404).json({
                status : "error",
                data : 'User not found'
            })
        }
        user.username = username
        user.gender = gender
        user.last_name = last_name
        user.first_name = first_name
        await user.save()
        return res.status(200).json({
            status : "success",
            message : "User Profile Updated Successfully",
            user 
        })
    } catch (error) {
        return res.status(422).json({
            status : "error",
            message : error.message
        })
    }
}

module.exports = {
    createUser,
    updateUserInfo,
    getUser
}