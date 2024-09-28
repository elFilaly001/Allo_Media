const Joi = require('joi');

// Schema for registration with custom error messages
const registerSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.empty': 'Username is required',
            'string.min': 'Username must be at least 3 characters long',
            'string.max': 'Username must not exceed 30 characters',
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please enter a valid email address',
        }),
    password: Joi.string()
        .min(3)
        .required()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 8 characters long',
        }),
    phone: Joi.string()
        .pattern(/^0[0-9]{9}$/)
        .required()
        .messages({
            'string.empty': 'Phone number is required',
            'string.pattern.base': 'Phone number must start with 0 and contain 10 digits',
        }),
    role: Joi.string()
        .valid('admin', 'user', 'moderator', 'joke') // Allowed roles
        .required()
        .messages({
            'string.empty': 'Role is required',
            'any.only': 'Role must be either admin, user, or moderator',
        }),
});

// Schema for login with custom error messages
const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please enter a valid email address',
        }),
    password: Joi.string()
        .min(3)
        .required()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 8 characters long',
        })
});


const forgetPasswordSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please enter a valid email address',
        })
});

// Middleware for registration validation with custom messages
const validateRegister = (req, res, next) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

// Middleware for login validation with custom messages
const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const validateEmail = (req, res, next) => {
    const { error } = forgetPasswordSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}
module.exports = { validateRegister, validateLogin, validateEmail };
