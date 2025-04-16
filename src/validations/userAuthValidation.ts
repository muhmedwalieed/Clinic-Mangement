import { body } from "express-validator";
import { USER_ROLES } from "@prisma/client";
import { validatorInput } from "../middlewares/handleInputsErrors";
import { filterValidData, initValidData, initValidQuery } from "../middlewares/filterValidDataMiddleware";

const role = [USER_ROLES.DOCTOR, USER_ROLES.ADMIN, USER_ROLES.NURSE];

const createUser = [
    initValidData,
    body("username")
        .isString()
        .withMessage("Please provide a valid username.")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Username cannot be empty.")
        .bail()
        .isLength({ min: 5 })
        .withMessage("Username must be at least 5 characters long.")
        .bail()
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage("Username must contain only English letters and numbers.")
        .bail()
        .custom((value, { req }) => {
            req.body.validData["username"] = value.trim().toLowerCase();
            return true;
        }),
    body("userRole")
        .isString()
        .withMessage("Invalid Role")
        .bail()
        .isIn([...role.map((role) => role.toLowerCase()), ...role.map((role) => role.toUpperCase())])
        .withMessage("Invalid Role")
        .bail()
        .custom((val, { req }) => {
            req.body.validData["userRole"] = val.toUpperCase();
            return true;
        }),
    validatorInput,
    filterValidData,
];

const login = [
    initValidData,
    body("username")
        .isString()
        .withMessage("Please provide a valid username.")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Username cannot be empty.")
        .bail()
        .isLength({ min: 5 })
        .withMessage("Username must be at least 5 characters long.")
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage("Username must contain only English letters and numbers.")
        .bail()
        .custom((value, { req }) => {
            req.body.validData["username"] = value.trim().toLowerCase();
            return true;
        }),
    body("password")
        .notEmpty()
        .withMessage("Password is required.")
        .bail()
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long.")
        .bail()
        .custom((value, { req }) => {
            req.body.validData["password"] = value;
            return true;
        }),
    validatorInput,
    filterValidData,
];

export { createUser, login };
