import { Router } from "express";
import {
    createClinic,
    deleteClinic,
    getClinic,
    getClinics,
    updateClinic,
} from "../handlers/clinicHandler";
import { protect } from "../utils/jwtUtils";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { USER_ROLES } from "@prisma/client";
import * as clinicValidationIN from "../validations/clinicValidation";
import * as clinicValidationDB from "../validationsDB/clinicValidation";
import { globalErrorHandel } from "../middlewares/globalErrorHandel";

const router = Router();

router.get(
    "/",
    protect,
    authorizeRoles([USER_ROLES.OWNER, USER_ROLES.ADMIN]),
    getClinics
);
router.get(
    "/:clinicId",
    protect,
    authorizeRoles([USER_ROLES.OWNER, USER_ROLES.ADMIN]),
    clinicValidationIN.getClinic,
    clinicValidationDB.getClinic,
    getClinic
);
router.post(
    "/",
    protect,
    authorizeRoles([USER_ROLES.OWNER, USER_ROLES.ADMIN]),
    clinicValidationIN.createClinic,
    clinicValidationDB.createClinic,
    createClinic
);
router.put(
    "/:clinicId",
    protect,
    authorizeRoles([USER_ROLES.OWNER, USER_ROLES.ADMIN]),
    clinicValidationIN.updateClinic,
    clinicValidationDB.updateClinic,
    updateClinic
);
router.delete(
    "/:clinicId",
    protect,
    authorizeRoles([USER_ROLES.OWNER]),
    clinicValidationIN.deleteClinic,
    clinicValidationDB.deleteClinic,
    deleteClinic
);

router.use(globalErrorHandel);

export default router;
