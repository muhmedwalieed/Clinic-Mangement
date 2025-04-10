import { Router } from "express";

import { USER_ROLES } from "@prisma/client";

import { protect } from "../utils/jwtUtils";

import { authorizeRoles } from "../middlewares/authorizeRoles";

import * as userValidationIN from "../validations/userValidation";

import * as userHandler from "../handlers/userHandler";

import * as userValidationDB from "../validationsDB/userAuthValidatin";

import { globalErrorHandel } from "../middlewares/globalErrorHandel";

const router = Router();
 
router.post(
    "/register",
    protect,
    authorizeRoles([USER_ROLES.OWNER, USER_ROLES.ADMIN]),
    userValidationIN.createUser,
    userValidationDB.createUser,
    userHandler.createUser
);

router.post(
    "/login",
    userValidationIN.login,
    userValidationDB.login,
    userHandler.login
);

router.use(globalErrorHandel);

export default router;
