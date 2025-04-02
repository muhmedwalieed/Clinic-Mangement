import { Router } from "express";
import { protect } from "../utils/jwtUtils";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { USER_ROLES } from "@prisma/client";
import * as userValidationIN from "../validations/userValidation";
import * as userHandler from "../handlers/userHandler";
import * as userValidationDB from "../validationsDB/userAuthValidatin";

import { globalErrorHandel } from "../middlewares/globalErrorHandel";

const router = Router();

//get users
router.get(
    "/",
    protect,
    authorizeRoles([USER_ROLES.OWNER, USER_ROLES.ADMIN]),
    // userValidationIN.getUsers,
    userValidationDB.getUsers,
    userHandler.getUsers
);
//get user
router.get(
    "/:userId",
    protect,
    authorizeRoles([USER_ROLES.OWNER, USER_ROLES.ADMIN]),
    userValidationIN.getUser,
    userValidationDB.getUser,
    userHandler.getUser
);
//update user
router.put(
    "/",
    protect,
    userValidationIN.updateUser,
    userValidationDB.update,
    userHandler.updateUser
);
//change password
router.put(
    "/change-password",
    protect,
    userValidationIN.changePassword,
    userValidationDB.changePassword,
    userHandler.updateUser
);
//delete user
router.delete(
    "/:userId",
    protect,
    authorizeRoles([USER_ROLES.OWNER, USER_ROLES.ADMIN]),
    userValidationIN.deleteUser,
    userValidationDB.deleteUser,
    userHandler.deleteUser
);

router.use(globalErrorHandel);

export default router;
