const express = require("express");
const cookieParser = require('cookie-parser');

require("dotenv").config();
require("./config/database");

const apiRoutes = require("./routes/api");
const webRoutes = require("./routes/web");

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use("/", webRoutes);
app.use("/api", apiRoutes);

module.exports = app;
