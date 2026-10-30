import { describe, it, expect } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import {app} from "./app";

const secret = process.env.JWT_SECRET;

if (!secret){
    throw new Error("JWT_SECRET is missing from test environment.");
}

describe("JWT authentication API", ()=>{
    it("allows access to the public route", async ()=>{
        const response = await request(app).get("/api/public");

        expect(response.status).toBe(200);
        expect(response.body.message).toContain("welcome");
    });

    it("rejects profile access without a token", async ()=> {
        const response = await request(app).get("/api/profile");
        expect(response.status).toBe(401);
    });

    it("rejects incorrect login credentials", async()=> {
        const response = await request(app)
        .post("/api/auth/login")
        .send({
            email: "kamal@example.com",
            password: "wrong-password"
        });
        expect(response.status).toBe(401);
    });
    it("issues a JWT for valid credentials", async()=>{
        const response = await request(app)
        .post("/api/auth/login")
        .send({
            email:"kamal@example.com",
            password: "Kamal123"
        });
        expect(response.status).toBe(200);
        expect(typeof response.body.token).toBe("string");

        const decoded = jwt.verify(response.body.token, secret);

        expect(decoded).toMatchObject({
            userId: 1,
            email: "kamal@example.com"
        });
    });

    it("allows access with a valid token", async()=>{
        const login = await request(app)
        .post("/api/auth/login")
        .send({
            email:"kamal@example.com",
            password: "Kamal123"
        });
        const token = login.body.token;

        const response = await request(app)
        .get("/api/profile")
        .set("Authorization", `Bearer ${token}`);
});
it ("rejects a tampered token", async() => {
    const login = await request(app)
    .post("/api/auth/login")
    .send({
        email: "kamal@example.com",
        password: "Kamal123"
    });
    const token = login.body.token ;
    const parts = token.split(".");

    parts[1] = parts[1].slice(0, -1) + (parts[1].endsWith("a") ? "b" : "a");
    const response = await request(app)
      .get("/api/profile")
      .set("Authorization", `Bearer ${parts.join(".")}`);

    expect(response.status).toBe(401);
});
it("rejects an expired token", async () => {
    const expiredToken = jwt.sign(
      {
        userId: 1,
        email: "asha@example.com"
      },
      secret,
      {
        algorithm: "HS256",
        expiresIn: -10
      }
    );

    const response = await request(app)
      .get("/api/profile")
      .set("Authorization", `Bearer ${expiredToken}`);

    expect(response.status).toBe(401);
  });

  it("rejects an empty bearer token", async () => {
    const response = await request(app)
      .get("/api/profile")
      .set("Authorization", "Bearer ");

    expect(response.status).toBe(401);
  });
})