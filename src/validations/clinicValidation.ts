import { body, param } from "express-validator";
import { validatorInput } from "../middlewares/handleInputsErrors";
import { Request, Response, NextFunction } from "express";
import { filterValidData } from "../middlewares/filterValidDataMiddleware";

const initValidData = (req: Request, res: Response, next: NextFunction) => {
    req.body ? req.body : {};
    req.body.validData = {};
    next();
};

const getClinic = [
    param("clinicId")
        .isString()
        .withMessage("Please provide a valid clinic ID.")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Clinic ID cannot be empty.")
        .bail()
        .isLength({ min: 36, max: 36 })
        .withMessage("Invalid Clinic ID"),
];

const createClinic = [
    initValidData,
    body("name")
        .isString()
        .withMessage("Please provide a valid clinic name.")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Clinic name cannot be empty.")
        .bail()
        .isLength({ min: 5 })
        .withMessage("Clinic name must be at least 5 characters long.")
        .bail()
        .custom((value, { req }) => {
            req.body.validData["name"] = value.trim().toLowerCase();
            return true;
        }),
    body("doctorId")
        .isString()
        .withMessage("Please provide a valid doctor ID.")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Doctor ID cannot be empty.")
        .bail()
        .isLength({ min: 36, max: 36 })
        .withMessage("Invalid Doctor ID")
        .bail()
        .custom((value, { req }) => {
            req.body.validData["doctorId"] = value.trim().toLowerCase();
            return true;
        }),
    validatorInput,
    filterValidData,
];

const updateClinic = [
    initValidData,
    param("clinicId")
        .isString()
        .withMessage("Please provide a valid clinic ID.")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Clinic ID cannot be empty.")
        .bail()
        .isLength({ min: 36, max: 36 })
        .withMessage("Invalid Clinic ID"),
    body("name")
        .optional()
        .isString()
        .withMessage("Please provide a valid clinic name.")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Clinic name cannot be empty.")
        .bail()
        .isLength({ min: 5 })
        .withMessage("Clinic name must be at least 5 characters long.")
        .bail()
        .custom((value, { req }) => {
            req.body.validData["name"] = value.trim().toLowerCase();
            return true;
        }),
    body("consultationFee")
        .optional()
        .isFloat()
        .withMessage("Invalid consultationFee")
        .custom((value, { req }) => {
            req.body.validData["consultationFee"] = value;
            return true;
        }),
    body("followUpFee")
        .optional()
        .isFloat()
        .withMessage("Invalid consultationFee")
        .custom((value, { req }) => {
            req.body.validData["followUpFee"] = value;
            return true;
        }),
    validatorInput,
    filterValidData,
];

const deleteClinic = [
    param("clinicId")
        .isString()
        .withMessage("Please provide a valid clinic ID.")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Clinic ID cannot be empty.")
        .bail()
        .isLength({ min: 36, max: 36 })
        .withMessage("Invalid Clinic ID"),
];

export { getClinic, createClinic, updateClinic, deleteClinic };
