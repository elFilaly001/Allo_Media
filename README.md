# JWT Authentication with Node.js

## 1. Introduction

### Project Overview
This project is a web application built with Node.js and Express that uses JSON Web Tokens (JWT) for authentication. It provides a secure way for users to register, log in, and access protected routes.

### Purpose and Goals
The main goal of this project is to implement a secure authentication mechanism using JWT to protect endpoints and allow only authenticated users to perform certain actions.

### Target Audience
This application is suitable for developers looking to integrate JWT-based authentication into their Node.js applications.

## 2. Getting Started

### Prerequisites
- Node.js
- npm

### Installation Instructions
1. Clone the repository:
   ```sh
   git clone https://github.com/elFilaly001/Allo_media.git
    ```
2. Navigate to the project directory:
   ```sh
   cd Allo_media
   ```
3. Install the dependencies:
   ```sh
    npm install
    ```

## Quick Start Guide
1. Create a `.env` file in the root directory and add the following environment variables:
   ```sh
    APP_HOST=localhost
   
    # Mongodb URI
    DB_URI=
    TEST_DB_URI=
   
    # JWT secret key
    JWT_SECRET=
   
    # Mail configuration
    MAIL_HOST=
    MAIL_PORT=
    MAIL_USER=
    MAIL_PASS=
    ```
2. Start the server:
    ```sh
     npm start
     ```
3. Access the application at `http://localhost:3000`.

## 3. Project Structure

### Overview
The project structure is as follows:
```
JWT-Authentication/
├── config/
├── controllers/
├── middleware/
├── models/
├── public/
├── routes/
│   └── api.js
├── services/
├── validation/
├── views/
│   └── mail/
├── .env
├── app.js
├── README.md
└── server.js
```

### Description

- `config/`: Contains the configuration files.
- `controllers/`: Contains the controller files for handling the application logic.
- `middleware/`: Contains middleware, such as the JWT authentication middleware.
- `models/`: Contains the model files for defining the database schema.
- `routes/`: Contains the route files for defining the application routes.
- `services/`: Holds utility functions that are used across the application.
- `views/`: Contains the view files for rendering the HTML pages.
- `validation/`: Contains validation logic for user inputs.
- `.env`: Contains the environment variables for the application.
- `app.js`: Contains the main application file.
- `server.js`: Server entry point file that starts the Express server.


## 4. Features

- User Authentication
    - Registration: Create a new user account.
    - Login: Authenticate users using email and password.
    - Logout: Clear the cookie and log out the user.
    - JWT Token Generation: Generate a token upon successful login.
    - Protected Routes: Only accessible with a valid JWT token.
- Password Management
    - Password Hashing: Securely store user passwords using bcrypt.
    - Password Reset: Reset the password using a secure token sent via email.
- Token Refresh
    - Generate a new token when the existing token expires.
- OTP Verification
    - OTP verification is required when logging in from a new device or location.
    - OTP is sent via email or SMS, depending on the user's choice.
    - OTP is valid for a limited time.
- Middleware
    - Input Validation: Middleware for validating inputs in requests.
    - JWT Validation: Middleware for validating JWT tokens in requests.
 

## 5. Packages Used

- `bcrypt`: Library to help you hash passwords
- `cookie-parser`: Parse Cookie header and populate `req.cookies` with an object keyed by the cookie names
- `dotenv`: Loads environment variables from a `.env` file into `process.env`
- `express`: Fast, unopinionated, minimalist web framework for Node.js
- `joi`: Object schema description language and validator for JavaScript objects
- `jsonwebtoken`: An implementation of JSON Web Tokens
- `mongoose`: MongoDB object modeling tool designed to work in an asynchronous environment
- `nodemailer`: Send e-mails from Node.js