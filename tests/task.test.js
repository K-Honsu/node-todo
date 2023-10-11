const app = require("../main")
const supertest = require("supertest")
const { connect } = require("./database")
const UserModel = require("../models/user")

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

})