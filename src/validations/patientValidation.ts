import { body, param } from "express-validator";
import { validatorInput } from "../middlewares/handleInputsErrors";
import { filterValidData, initValidData } from "../middlewares/filterValidDataMiddleware";

const getPatient = [
    param("phone")
        .isString()
        .withMessage("Please provide a valid phone number.")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required.")
        .bail()
        .matches(/^01[0-9]{9}$/)
        .withMessage("Phone number must start with 01 and be exactly 11 digits."),
    validatorInput,
];

const createPatient = [
    initValidData,

    body("firstName")
        .isString()
        .withMessage("Please provide a valid first name.")
        .trim()
        .notEmpty()
        .withMessage("First name is required.")
        .bail()
        .isLength({ min: 2 })
        .withMessage("First name must be at least 2 characters long.")
        .bail()
        .matches(/^[\u0621-\u064A\u0660-\u0669a-zA-Z0-9\s]+$/)
        .withMessage("First name must contain only Arabic, English letters, and numbers.")
        .bail()
        .custom((value, { req }) => {
            value = value.trim();
            req.body.validData["firstName"] = value;
            return true;
        }),

    body("lastName")
        .isString()
        .withMessage("Please provide a valid last name.")
        .trim()
        .notEmpty()
        .withMessage("Last name is required.")
        .bail()
        .isLength({ min: 2 })
        .withMessage("Last name must be at least 2 characters long.")
        .bail()
        .matches(/^[\u0621-\u064A\u0660-\u0669a-zA-Z0-9\s]+$/)
        .withMessage("Last name must contain only Arabic, English letters, and numbers.")
        .bail()
        .custom((value, { req }) => {
            value = value.trim();
            req.body.validData["lastName"] = value;
            return true;
        }),

    body("phone")
        .isString()
        .withMessage("Please provide a valid phone number.")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required.")
        .bail()
        .matches(/^01[0-9]{9}$/)
        .withMessage("Phone number must start with 01 and be exactly 11 digits.")
        .bail()
        .custom((value, { req }) => {
            req.body.validData["phone"] = value.trim();
            return true;
        }),

    validatorInput,
    filterValidData,
];

const validPhone = [
    initValidData,
    body("phone")
        .isString()
        .withMessage("Please provide a valid phone number.")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required.")
        .bail()
        .matches(/^01[0-9]{9}$/)
        .withMessage("Phone number must start with 01 and be exactly 11 digits.")
        .bail()
        .custom((value, { req }) => {
            req.body.validData["phone"] = value.trim();
            return true;
        }),
    validatorInput,
    filterValidData,
];

export { getPatient, createPatient, validPhone };
