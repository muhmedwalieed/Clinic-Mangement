import { Router } from "express";
import { globalErrorHandel } from "../middlewares/globalErrorHandel";
import {
    createConsultation,
    deleteConsultation,
    getConsultation,
    getConsultations,
    updateConsultation,
} from "../handlers/consultationHandler";
import * as patientValidationIN from "../validations/patientValidation";
import * as patientValidationDB from "../validationsDB/patientValidation";
import * as consultationValidationIN from "../validations/consultationValidation";
import * as consultationValidationDB from "../validationsDB/consultationValidation";

const router = Router();

// get all Consultations
router.get("/", getConsultations);

router.get("/:consultationId", getConsultation);

//create consultation to new user
router.post("/", patientValidationIN.createPatient, patientValidationDB.createPatient, createConsultation);

//create consultation to exist user
router.post(
    "/patients/:patientId",
    consultationValidationIN.createConsultation,
    consultationValidationDB.createConsultation,
    createConsultation
);

router.put(
    "/:consultationId",
    consultationValidationIN.updateConsultation,
    consultationValidationDB.updateConsultation,
    updateConsultation
);

router.use(globalErrorHandel);

export default router;
