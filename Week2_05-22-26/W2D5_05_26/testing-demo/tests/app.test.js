const request = require('supertest');
const app = require('../src/app');

const username = "Kamal";
const age = 23;
const email = undefined;
const user = {
    name: "kamal",
    role: "admin"
};
const skills = ["JavaScript", "Node.js", "React"];

test("GET /api/health returns status 200 and correct response", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
});

test("GET /api/users returns users", async () => {
    const response = await request(app)
        .get("/api/users");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toBe("Kamal");
});

test("POST /api/users creates a new user", async () => {
    const newUser = { name: "Aagyat" };
    const response = await request(app)
        .post("/api/users")
        .send(newUser);
    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe("Aagyat");
    expect(response.body.id).toBeDefined();
});







test ("username is defiened",()=>{
    expect(username).toBeDefined();
})
test("username is a kamal", ()=>{
    expect(username).toBe("Kamal");
})

test ("age is greater than 18", ()=>{
    expect(age).toBeGreaterThan(18);
})
test("email is undefined", ()=>{
    expect(email).toBeUndefined();
})
test("user is defined", ()=>{
    expect(user).toBeDefined();
})
test("user name is kamal", ()=>{
    expect(user.name).toBe("kamal");
})
test("user role is admin", ()=>{
    expect(user.role).toBe("admin");
})
test("skills is defined", ()=>{
    expect(skills).toBeDefined();
})
test("skills has 3 elements", ()=>{
    expect(skills).toHaveLength(3);
})

test("username is not ram",()=>{
    expect(username).not.toBe("ram");
});

beforeAll(() => {
    console.log("Runs before all test");
});
// beforeEach(() => {
    //     console.log("Runs before every test");
    // });
    // afterEach(() => {
    //     console.log("Runs after every test");
    // });
    afterAll(() => {
        console.log("Runs after all test");
    });