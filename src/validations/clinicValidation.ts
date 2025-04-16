import { body, param, query } from "express-validator";
import { validatorInput } from "../middlewares/handleInputsErrors";
import { filterValidData, initValidData, initValidQuery } from "../middlewares/filterValidDataMiddleware";

const getClinics = [
    initValidQuery,
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
        .withMessage("Invalid User ID")
        .custom((val, { req }) => {
            req.prismaQuery["doctorId"] = val;
            return true;
        }),
    query("adminId")
        .optional()
        .isString()
        .withMessage("Please provide a valid admin ID.")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Admin ID cannot be empty.")
        .bail()
        .isLength({ min: 36, max: 36 })
        .withMessage("Invalid Admin ID")
        .custom((val, { req }) => {
            req.prismaQuery["adminId"] = val;
            return true;
        }),
    query("doctorId")
        .optional()
        .isString()
        .withMessage("Please provide a valid doctor ID.")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Doctor ID cannot be empty.")
        .bail()
        .isLength({ min: 36, max: 36 })
        .withMessage("Invalid Doctor ID")
        .custom((val, { req }) => {
            req.prismaQuery["doctorId"] = val;
            return true;
        }),
    validatorInput,
];

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
    body("clinic.name")
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
    validatorInput,
    filterValidData,
];

const updateClinic = [
    initValidData,
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
    body("EXPIRATION_DAYS")
        .optional()
        .isFloat()
        .withMessage("Invalid EXPIRATION_DAYS")
        .custom((value, { req }) => {
            req.body.validData["EXPIRATION_DAYS"] = value;
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

export { getClinics, getClinic, createClinic, updateClinic, deleteClinic };
