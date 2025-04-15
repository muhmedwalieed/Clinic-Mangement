import { Router } from "express";

import { USER_ROLES } from "@prisma/client";

import { protect } from "../utils/jwtUtils";

import { authorizeRoles } from "../middlewares/authorizeRoles";

import * as patientHandler from "../handlers/patientHandler";

import * as patientValidationIN from "../validations/patientValidation";
import * as patientValidationDB from "../validationsDB/patientValidation";

import { globalErrorHandel } from "../middlewares/globalErrorHandel";
import { isHaveClinic } from "../middlewares/DoctorHaveClinic";

const router = Router();

router.get(
    "/:phone",
    authorizeRoles([USER_ROLES.DOCTOR, USER_ROLES.NURSE]),
    isHaveClinic,
    patientValidationIN.getPatient,
    patientValidationDB.getPatient,
    patientHandler.getPatient
);

router.post(
    "/",
    authorizeRoles([USER_ROLES.DOCTOR, USER_ROLES.NURSE]),
    isHaveClinic,
    patientValidationIN.createPatient,
    patientValidationDB.createPatient,
    patientHandler.createPatient
);

router.post(
    "/check-phone",
    authorizeRoles([USER_ROLES.DOCTOR, USER_ROLES.NURSE]),
    isHaveClinic,
    patientValidationIN.validPhone,
    patientHandler.checkPhoneExists
);

router.use(globalErrorHandel);

export default router;
