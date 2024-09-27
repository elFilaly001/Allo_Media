const mongoose = require("mongoose");
const createServer = require("../server.js");

let app;

beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/acmedb", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    app = createServer();
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

beforeEach(async () => {
    // Clear all collections before each test
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});

module.exports = { app };