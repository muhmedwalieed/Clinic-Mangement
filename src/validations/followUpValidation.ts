import { body } from "express-validator";
import { validatorInput } from "../middlewares/handleInputsErrors";

const createFollowUp = [
    body("consultationId")
        .isString()
        .withMessage("Please provide a valid consultation ID.")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Consultation ID cannot be empty.")
        .bail()
        .isLength({ min: 36, max: 36 })
        .withMessage("Invalid Consultation ID"),
    validatorInput,
];

export { createFollowUp };
