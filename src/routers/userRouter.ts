import { Router } from "express";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { USER_ROLES } from "@prisma/client";
import * as userValidationIN from "../validations/userValidation";
import * as userHandler from "../handlers/userHandler";
import * as userValidationDB from "../validationsDB/userAuthValidatin";
import clinicRouter from "./clinicRouter";
import { globalErrorHandel } from "../middlewares/globalErrorHandel";
import { deleteUserRelations } from "../middlewares/deleteUserRelations";
import { checkUserProfile } from "../middlewares/ValidUser";

const router = Router();
///api/users/userId/clinic
router.use("/:userId/clinics", clinicRouter);

//get users
router.get(
    "/",
    checkUserProfile,
    authorizeRoles([USER_ROLES.OWNER, USER_ROLES.ADMIN]),
    userValidationIN.getUsers,
    userValidationDB.getUsers,
    userHandler.getUsers
);
//info مؤقت
router.get("/info", checkUserProfile, userValidationDB.getUser, userHandler.getUser);
//get user
router.get("/:userId", checkUserProfile, userValidationIN.getUser, userValidationDB.getUser, userHandler.getUser);

//update user
router.put("/:userId", userValidationIN.updateUser, userValidationDB.update, userHandler.updateUser);

router.post(
    "/check-username",
    checkUserProfile,
    authorizeRoles([USER_ROLES.OWNER, USER_ROLES.ADMIN]),
    userValidationIN.checkUser,
    userHandler.checkUser
);

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
