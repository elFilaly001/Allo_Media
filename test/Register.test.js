const request = require("supertest")
const { faker } = require('@faker-js/faker');
const User = require('../models/Users.js');
const app = require("../app.js");

function generatePhoneNumber() {
    return Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('');
}


describe('POST /api/Auth/Register', () => {
    it("Should create/register a new user using valid data", async () => {
        const username = faker.person.firstName(); 
        const email = faker.internet.email();
        const password = faker.internet.password(8); 
        const phone = generatePhoneNumber();

        const response = await request(app)
            .post("/api/Auth/Register")
            .send({
                username,
                email,
                password,
                phone,
                role:"joke",
            });

        // Check the status code
        expect(response.status).toBe(201); // Adjust according to your API response

        // Check if user was created in the database
        const user = await User.findOne({ email: email });
        expect(user).toBeDefined(); // Assert that user is defined

        // Clean up after test
        await User.deleteOne({ email: email });
    });

    it("Should check if user exist ", async () => {
        const response = await request(app)
            .post("/api/Auth/Register")
            .send({
                username:"abdou",
                email: "elfilalyabdeljalil@gmail.com",
                password:"123",
                phone: "1234567890",
                role:"joke",
            });

        // Check the status code
        expect(response.status).toBe(400); // Check for 400 status code
        expect(response.body).toHaveProperty('message'); // Check if response body contains 'message' property// Adjust according to your API response
    });

    it("Should check if data is in valid ", async () => {
        const response = await request(app)
            .post("/api/Auth/Register")
            .send({
                username:"abdou",
                email: "elfilalyabdeljalilgmail.com",
                password:"123",
                phone: "1234567890",
                role:"joke",
            });

        // Check the status code
        expect(response.status).toBe(400); // Check for 400 status code
        expect(response.body).toHaveProperty('message'); // Check if response body contains 'message' property// Adjust according to your API response
    });

    
});


