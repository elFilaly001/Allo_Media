const request = require("supertest")
const User = require('../models/Users.js')
const app = require("../app.js")


describe('POST /api/Auth/Login', () => {

    it("Should log the user using valid data", async () => {
        const response = await request(app)
            .post("/api/Auth/Login")
            .send({
                email : "elfilalyabdeljalil@gmail.com",
                password: "123",
            });

        // Check the status code
        expect(response.status).toBe(201);
    });

    it("Should check if does not user exist ", async () => {
        const response = await request(app)
            .post("/api/Auth/Login")
            .send({
                email: "elfilalyabdeljali@gmail.com",
                password:"123",
            });

        // Check the status code
        expect(response.status).toBe(404); // Check for 404 status code
        expect(response.body).toHaveProperty('error'); 
    });

    it("Should check if data is in valid ", async () => {
        const response = await request(app)
            .post("/api/Auth/Login")
            .send({
                email: "elfilalyabdeljalilgmail.com",
                password:"123",
            });

        // Check the status code
        expect(response.status).toBe(400); // Check for 400 status code
        expect(response.body).toHaveProperty('message'); // Check if response body contains 'message' property// Adjust according to your API response
    });    
});