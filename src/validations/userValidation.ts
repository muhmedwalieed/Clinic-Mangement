import { body, param, query } from "express-validator";
import { USER_ROLES } from "@prisma/client";
import { validatorInput } from "../middlewares/handleInputsErrors";
import {
    filterValidData,
    filterValidQuery,
} from "../middlewares/filterValidDataMiddleware";
import { Request, Response, NextFunction } from "express";

const initValidData = (req: Request, res: Response, next: NextFunction) => {
    req.body.validData = {};
    next();
};

export const createUser = [
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
    body("role")
        .notEmpty()
        .withMessage("Please select a user role.")
        .bail()
        .custom((value, { req }) => {
            const upperRole = value.toUpperCase();
            if (!Object.values(USER_ROLES).includes(upperRole)) {
                throw new Error(
                    "Invalid role selected. Please choose a valid role."
                );
            }
            req.body.validData["userRole"] = upperRole;
            return true;
        }),
    validatorInput,
    filterValidData,
];

export const login = [
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

export const updateUser = [
    initValidData,
    body("firstName")
        .optional()
        .isString()
        .withMessage("Please provide a valid first name.")
        .trim()
        .notEmpty()
        .withMessage("first name cannot be empty.")
        .bail()
        .isLength({ min: 5 })
        .withMessage("first name must be at least 5 characters long.")
        .bail()
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage(
            "first name must contain only English letters and numbers."
        )
        .bail()
        .custom((value, { req }) => {
            value = value.trim();
            value =
                value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
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
        .isLength({ min: 5 })
        .withMessage("last name must be at least 5 characters long.")
        .bail()
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage("last name must contain only English letters and numbers.")
        .bail()
        .custom((value, { req }) => {
            value = value.trim();
            value =
                value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
            req.body.validData["lastName"] = value;
            return true;
        }),
    validatorInput,
    filterValidData,
];

export const changePassword = [
    initValidData,
    body("currentPassword")
        .optional()
        .isLength({ min: 8 })
        .withMessage("Invalid current password.")
        .custom((value, { req }) => {
            req.body.validData["currentPassword"] = value;
        }),
    body("newPassword")
        .optional()
        .isLength({ min: 8 })
        .withMessage(
            "new Password must be at least 8 characters long if provided."
        )
        .custom((value, { req }) => {
            req.body.validData["newPassword"] = value;
        }),
    validatorInput,
    filterValidData,
];

export const getUsers = [
    query("roles")
        .optional()
        .custom((value, { req }) => {
            const roles = value;
            const rolesArray = roles
                ? (roles as string)
                      .split(",")
                      .map((role) => role.toUpperCase() as USER_ROLES)
                : [];
            const query =
                rolesArray.length > 0
                    ? {
                          userRole: {
                              in: rolesArray,
                          },
                      }
                    : {};
            (req as any).query.validQuery = query;
        }),
    filterValidQuery,
];

export const getUser = [
    param("userId")
        .isString()
        .withMessage("User ID must be a string")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("User ID cannot be empty"),
    validatorInput,
];

export const deleteUser = [
    param("userId")
        .isString()
        .withMessage("User ID must be a string")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("User ID cannot be empty"),
    validatorInput,
];
