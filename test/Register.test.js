const request = require("supertest");
const { faker } = require('@faker-js/faker');
const User = require('../models/Users.js');
const app = require("../server.js");

describe('POST /api/Auth/Register', () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    it("Should create/register a new user using valid data", async () => {
        const username = faker.person.firstName(); 
        const email = faker.internet.email();
        const password = faker.internet.password(8); 
        const phone = faker.phone.number("0#########");

        const response = await request(app)
            .post("/api/Auth/Register")
            .send({
                username,
                email,
                password,
                phone,
            });

        // Check the status code
        expect(response.status).toBe(201); // Adjust according to your API response

        // Check if user was created in the database
        const user = await User.findOne({ email: email });
        expect(user).toBeDefined(); // Assert that user is defined

        // Clean up after test
        await User.deleteOne({ email: email });
    });
});