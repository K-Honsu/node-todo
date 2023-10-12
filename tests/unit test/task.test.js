const app = require("../../main")
const supertest = require("supertest")
const { connect } = require("./database")
const UserModel = require("../../models/user")
const TaskModel = require("../../models/task")

describe("Task Route", () => {
    let connection
    let token

    beforeAll(async () => {
        connection = await connect()
    })

    beforeEach(async () => {
        const user = await UserModel.create({
            first_name : "emmanuel",
            last_name : "adeyemi",
            username : "feragambo1",
            email : "feranmia511@gmail.com", 
            gender : "male",
            password : "passwordispassword"
        })
        const response = await supertest(app)
        .post("/auth/login")
        .set("content-type", "application/json")
        .send({
            username : "feragambo1",
            password : "passwordispassword"
        })
        token = response.body.token
        const task = await TaskModel.create({
            title : "chores",
            description : "dont forget to ckean the house"
        })
        const res = await supertest(app)
        .post("/task/create")
        .set("authorization", `Bearer ${token}`)
        .set("content-type", "application/json")
        .send({
            title : "chores",
            description : "dont forget to ckean the house"
        })
        title = res.body.data.title
        id = res.body.data._id
    })

    afterEach(async () => {
        await connection.cleanup()
    })

    afterAll(async () => {
        await connection.disconnect()
    })

    it("should successfully create a task for the logged in user", async () => {
        const response = await supertest(app)
        .post("/task/create")
        .set("authorization", `Bearer ${token}`)
        .set("content-type", "application/json")
        .send({
            title : "chores",
            description : "to clean house",
        })
        expect(response.status).toEqual(201)
        expect(response.body.data).toMatchObject({
            title : "chores",
            description : "to clean house",
        })
    })

    it("should successfully get all task for authenticated user", async () => {
        const response = await supertest(app)
        .get("/task/")
        .set("authorization", `Bearer ${token}`)
        .set("content-type", "application/json")
        expect(response.status).toEqual(200)
        expect(response.body).toMatchObject({
            data : expect.any(Array)
        })
    })

    test("should successfully update a task for authenticated user", async () => {
        const response = await supertest(app)
        .patch(`/task/update/${id}`)
        .set("authorization", `Bearer ${token}`)
        .set("content-type", "application/json")
        .send({
            title : "book",
        })
        expect(response.status).toEqual(200)
        expect(response.body).toMatchObject({
            task : expect.any(Object)
        })
    })

    test("should suceesfully delete a task for authenticated user", async () => {
        const response = await supertest(app)
        .delete(`/task/delete/${id}`)
        .set("authorization", `Bearer ${token}`)
        .set("content-type", "application/json")
        expect(response.status).toEqual(200)
        expect(response.body).toMatchObject({
            message : "Task deleted successfully",
        })
    })

})