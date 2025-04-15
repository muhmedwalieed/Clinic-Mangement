import { body, param } from "express-validator";
import { validatorInput } from "../middlewares/handleInputsErrors";
import { filterValidData, initValidData } from "../middlewares/filterValidDataMiddleware";
import { STATUS } from "@prisma/client";

const createConsultation = [
    param("patientId")
        .isString()
        .withMessage("Please provide a valid patient ID.")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Patient ID cannot be empty.")
        .bail()
        .isLength({ min: 36, max: 36 })
        .withMessage("Invalid Patient ID"),
    validatorInput,
];

const updateConsultation = [
    // initValidData,
    param("consultationId")
        .isString()
        .withMessage("Please provide a valid consultation ID.")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Consultation ID cannot be empty.")
        .bail()
        .isLength({ min: 36, max: 36 })
        .withMessage("Invalid Consultation ID"),
    body("status")
        .notEmpty()
        .withMessage("Status is required")
        .bail()
        .isString()
        .withMessage("Status must be a string")
        .bail()
        .isIn([STATUS.cancelled, STATUS.completed, STATUS.pending])
        .withMessage("Status must be one of: pending, completed, cancelled"),
    body("description")
        .optional()
        .notEmpty()
        .withMessage("description is required")
        .bail()
        .isString()
        .withMessage("description must be a string"),
    validatorInput,
    // filterValidData,
];

export { createConsultation, updateConsultation };
