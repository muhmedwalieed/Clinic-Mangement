import { Router } from "express";
import { protect } from "../utils/jwtUtils";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { USER_ROLES } from "@prisma/client";
import * as userValidation from "../validations/userValidation";
import * as userHandler from "../handlers/userHandler";
import {checkCreateUserPermission} from "../middlewares/checkUserPermission";
import { globalErrorHandel } from "../middlewares/globalErrorHandel";

const router = Router();

//create user
router.post(
    "/register",
    protect,
    authorizeRoles([USER_ROLES.OWNER, USER_ROLES.ADMIN]),
    checkCreateUserPermission,
    userValidation.createUser,
    userHandler.createUser
);

router.post("/login", userValidation.login, userHandler.login);

router.get(
    "/",
    protect,
    authorizeRoles([USER_ROLES.OWNER, USER_ROLES.ADMIN]),
    userValidation.getUsers,
    userHandler.getUsers
);

router.get(
    "/:userId",
    protect,
    authorizeRoles([USER_ROLES.OWNER, USER_ROLES.ADMIN]),
    userValidation.getUser,
    userHandler.getUser
);

router.put("/", protect, userHandler.updateUser);

router.delete(
    "/:userId",
    protect,
    authorizeRoles([USER_ROLES.OWNER, USER_ROLES.ADMIN]),
    userHandler.deleteUser
);

router.use(globalErrorHandel);

export default router;
