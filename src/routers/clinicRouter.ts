import { Router } from "express";
import { createClinic, deleteClinic, getClinic, getClinics, updateClinic } from "../handlers/clinicHandler";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { USER_ROLES } from "@prisma/client";
import * as clinicValidationIN from "../validations/clinicValidation";
import * as clinicValidationDB from "../validationsDB/clinicValidation";
import { globalErrorHandel } from "../middlewares/globalErrorHandel";
import * as userValidationIN from "../validations/userValidation";
import * as userValidationDB from "../validationsDB/userAuthValidatin";
import { createUser } from "../middlewares/createUser";
import { isHaveClinic } from "../middlewares/DoctorHaveClinic";

const router = Router({ mergeParams: true });

router.get("/", authorizeRoles([USER_ROLES.OWNER, USER_ROLES.ADMIN]), clinicValidationIN.getClinics, getClinics);
router.get("/current", authorizeRoles([USER_ROLES.DOCTOR]), isHaveClinic, getClinic);

router.get(
    "/:clinicId",
    authorizeRoles([USER_ROLES.OWNER, USER_ROLES.ADMIN]),
    clinicValidationIN.getClinic,
    clinicValidationDB.getClinic,
    getClinic
);

// router.post(
//     "/",
//     authorizeRoles([USER_ROLES.OWNER, USER_ROLES.ADMIN]),
//     userValidationIN.createUser,
//     userValidationDB.createUser,
//     createUser(USER_ROLES.DOCTOR),
//     clinicValidationIN.createClinic,
//     createClinic
// );

router.put(
    "/",
    authorizeRoles([USER_ROLES.DOCTOR]),
    clinicValidationIN.updateClinic,
    clinicValidationDB.updateClinic,
    updateClinic
);

router.delete(
    "/:clinicId",
    authorizeRoles([USER_ROLES.OWNER]),
    clinicValidationIN.deleteClinic,
    clinicValidationDB.deleteClinic,
    deleteClinic
);

router.use(globalErrorHandel);

export default router;
