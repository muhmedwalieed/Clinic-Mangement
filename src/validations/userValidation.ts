import { body, param, query } from "express-validator";
import { USER_ROLES } from "@prisma/client";
import { validatorInput } from "../middlewares/handleInputsErrors";
import { filterValidData } from "../middlewares/filterValidDataMiddleware";
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
    body("firstName")
        .optional()
        .isString()
        .withMessage("Please provide a valid first name."),
    body("lastName")
        .optional()
        .isString()
        .withMessage("Please provide a valid last name."),
    body("password")
        .optional()
        .isLength({ min: 8 })
        .withMessage(
            "Password must be at least 8 characters long if provided."
        ),
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
            req.validQuery = query;
        }),
];

export const getUser = [
    param("userId")
        .isString()
        .withMessage("User ID must be a string")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("User ID cannot be empty"),
];
