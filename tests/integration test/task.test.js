const supertest = require("supertest");
const { connect } = require("../database");
const UserModel = require("../../models/user");
const app = require("../../main");

describe("Task API Integration Test", () => {
  let connection;
  let token;

  beforeAll(async () => {
    connection = await connect();
  });

  beforeEach(async () => {
    const user = await UserModel.create({
      first_name: "emmanuel",
      last_name: "adeyemi",
      username: "feragambo1",
      email: "feranmia511@gmail.com",
      gender: "male",
      password: "passwordispassword",
    });
    const response = await supertest(app)
      .post("/auth/login")
      .set("content-type", "application/json")
      .send({
        username: "feragambo1",
        password: "passwordispassword",
      });
    token = response.body.token;
  });

  afterEach(async () => {
    await connection.cleanup();
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  it("should create a new task and then fetch it", async () => {
    const newTask = {
      title: "Integration Test Task",
      description: "This is a test task created via integration test",
    };

    const createResponse = await supertest(app)
      .post("/task/create")
      .set("authorization", `Bearer ${token}`)
      .set("content-type", "application/json")
      .send(newTask);

    expect(createResponse.status).toEqual(201);
    expect(createResponse.body.data).toMatchObject(newTask);

    const taskId = createResponse.body.data._id;

    const fetchResponse = await supertest(app)
    .get(`/task/${taskId}`)
    .set("authorization", `Bearer ${token}`)
    .set("content-type", "application/json")
    expect(fetchResponse.status).toEqual(200)
    expect(fetchResponse.body).toMatchObject({
        existingTask : expect.any(Object)
    });
  });
});
