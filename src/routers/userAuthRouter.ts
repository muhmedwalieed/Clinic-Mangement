import { Router } from "express";

import { USER_ROLES } from "@prisma/client";

import { protect } from "../utils/jwtUtils";

import { authorizeRoles } from "../middlewares/authorizeRoles";

import * as userValidationIN from "../validations/userAuthValidation";

import * as userHandler from "../handlers/userAuthHandler";

import * as userValidationDB from "../validationsDB/userAuthValidation";

import { globalErrorHandel } from "../middlewares/globalErrorHandel";

const router = Router();

router.post(
    "/",
    protect,
    authorizeRoles([USER_ROLES.OWNER, USER_ROLES.ADMIN]),
    userValidationIN.createUser,
    userValidationDB.createUser,
    userHandler.createUser
);

router.post("/login", userValidationIN.login, userValidationDB.login, userHandler.login);

router.use(globalErrorHandel);

export default router;
