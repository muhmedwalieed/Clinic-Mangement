import { body, param, query } from "express-validator";
import { USER_ROLES } from "@prisma/client";
import { validatorInput } from "../middlewares/handleInputsErrors";
import { filterValidData, initValidData, initValidQuery } from "../middlewares/filterValidDataMiddleware";

const roles = [USER_ROLES.ADMIN, USER_ROLES.DOCTOR, USER_ROLES.NURSE];

export const getUsers = [
    initValidQuery,
    query("userRole")
        .optional()
        .isString()
        .withMessage("Invalid Role")
        .bail()
        .isIn([...roles.map((role) => role.toLowerCase()), ...roles.map((role) => role.toUpperCase())])
        .withMessage("Invalid Role")
        .bail()
        .custom((val, { req }) => {
            req.prismaQuery["userRole"] = val.toUpperCase();
            return true;
        }),
    query("username")
        .optional()
        .isString()
        .withMessage("Please provide a valid username.")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Username cannot be empty.")
        .bail()
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage("Username must contain only English letters and numbers.")
        .bail()
        .custom((value, { req }) => {
            req.prismaQuery["username"] = value.trim().toLowerCase();
            return true;
        }),
    validatorInput,
];

export const getUser = [
    param("userId")
        .isString()
        .withMessage("Please provide a valid user ID.")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("User ID cannot be empty.")
        .bail()
        .isLength({ min: 36, max: 36 })
        .withMessage("Invalid User ID"),
    validatorInput,
];

export const updateUser = [
    initValidData,
    param("userId")
        .optional()
        .isString()
        .withMessage("Please provide a valid user ID.")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("User ID cannot be empty.")
        .bail()
        .isLength({ min: 36, max: 36 })
        .withMessage("Invalid User ID"),
    body("firstName")
        .optional()
        .isString()
        .withMessage("Please provide a valid first name.")
        .trim()
        .notEmpty()
        .withMessage("first name cannot be empty.")
        .bail()
        .isLength({ min: 2 })
        .withMessage("first name must be at least 2 characters long.")
        .bail()
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage("first name must contain only English letters and numbers.")
        .bail()
        .custom((value, { req }) => {
            value = value.trim();
            value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
            req.body.validData["firstName"] = value;
            return true;
        }),
    body("lastName")
        .optional()
        .isString()
        .withMessage("Please provide a valid first name.")
        .trim()
        .notEmpty()
        .withMessage("last name cannot be empty.")
        .bail()
        .isLength({ min: 2 })
        .withMessage("last name must be at least 2 characters long.")
        .bail()
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage("last name must contain only English letters and numbers.")
        .bail()
        .custom((value, { req }) => {
            value = value.trim();
            value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
            req.body.validData["lastName"] = value;
            return true;
        }),
    validatorInput,
    filterValidData,
];

export const changePassword = [
    initValidData,
    body("currentPassword")
        .notEmpty()
        .withMessage("current Password is required")
        .isLength({ min: 8 })
        .withMessage("Invalid current password.")
        .custom((value, { req }) => {
            req.body.validData["currentPassword"] = value;
            return true;
        }),
    body("newPassword")
        .notEmpty()
        .withMessage("new Password is required")
        .isLength({ min: 8 })
        .withMessage("new Password must be at least 8 characters long if provided.")
        .custom((value, { req }) => {
            req.body.validData["newPassword"] = value;
            return true;
        }),
    validatorInput,
    filterValidData,
];

export const deleteUser = [
    param("userId")
        .isString()
        .withMessage("Please provide a valid user ID.")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("User ID cannot be empty.")
        .bail()
        .isLength({ min: 36, max: 36 })
        .withMessage("Invalid User ID"),
    validatorInput,
];

export const checkUser = [
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
        .withMessage("Invalid Username format.")
        .bail()
        .custom((value, { req }) => {
            req.body.validData["username"] = value.trim().toLowerCase();
            return true;
        }),
    validatorInput,
    filterValidData,
];
