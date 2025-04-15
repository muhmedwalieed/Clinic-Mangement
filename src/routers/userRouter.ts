import { Router } from "express";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { USER_ROLES } from "@prisma/client";
import * as userValidationIN from "../validations/userValidation";
import * as userHandler from "../handlers/userHandler";
import * as userValidationDB from "../validationsDB/userAuthValidatin";

import { globalErrorHandel } from "../middlewares/globalErrorHandel";
import { deleteUserRelations } from "../middlewares/deleteUserRelations";
import { checkUserProfile } from "../middlewares/ValidUser";

const router = Router();

router.post(
    "/check-username",
    checkUserProfile,
    authorizeRoles([USER_ROLES.OWNER, USER_ROLES.ADMIN]),
    userValidationIN.checkUser,
    userHandler.checkUser
);

//get users
router.get(
    "/",
    checkUserProfile,
    authorizeRoles([USER_ROLES.OWNER, USER_ROLES.ADMIN]),
    userValidationIN.getUsers,
    userValidationDB.getUsers,
    userHandler.getUsers
);
//get user
router.get(
    "/:userId",
    checkUserProfile,
    authorizeRoles([USER_ROLES.OWNER, USER_ROLES.ADMIN]),
    userValidationIN.getUser,
    userValidationDB.getUser,
    userHandler.getUser
);
//update user
router.put("/", userValidationIN.updateUser, userValidationDB.update, userHandler.updateUser);
//change password
router.put(
    "/change-password",
    userValidationIN.changePassword,
    userValidationDB.changePassword,
    userHandler.updateUser
);
//delete user
/**
 * IF U DELETE USER U ALSO DELETE anything RELATED IN THIS USER
 */
router.delete(
    "/:userId",
    checkUserProfile,
    authorizeRoles([USER_ROLES.OWNER, USER_ROLES.ADMIN]),
    userValidationIN.deleteUser,
    userValidationDB.deleteUser,
    deleteUserRelations,
    userHandler.deleteUser
);

router.use(globalErrorHandel);

export default router;
