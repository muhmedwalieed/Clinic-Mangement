import { Request, Response, NextFunction } from "express";
import { prisma } from "../data/database";
import CustomError from "../utils/customError";
import roleHierarchy from "../utils/roleHierarchy";
import { comparePasswords, hashPassword } from "../utils/hashUtils";
import { USER_ROLES } from "@prisma/client";
import { getUserWithFormat } from "../utils/getUser";

const Users = prisma.users;

const canAccess = (targetUserRole: string, actingUserRole: string) => {
    return roleHierarchy[actingUserRole] > roleHierarchy[targetUserRole] || actingUserRole === USER_ROLES.OWNER;
};

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    const query = req.prismaQuery!;
    const userRole = query.userRole;
    const currentUserRole = req.user?.userRole!;

    if (query.userRole) {
        const havePermission = canAccess(userRole, currentUserRole);
        if (!havePermission) {
            const permissionError = new CustomError("Access denied: insufficient permissions.", 403, {
                permission: "You are not allowed to access users with this role.",
            });
            return next(permissionError);
        } else {
            query.userRole = { in: [userRole] };
        }
    } else {
        const roles = [USER_ROLES.OWNER, USER_ROLES.ADMIN, USER_ROLES.DOCTOR, USER_ROLES.NURSE];
        const currentRole = req.user!.userRole;
        const accessibleRoles = roles.filter((targetRole) => canAccess(targetRole, currentRole));
        query.userRole = { in: accessibleRoles };
    }

    if (query.username) {
        query.username = {
            startsWith: query.username,
            mode: "insensitive",
        };
    }

    next();
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
    const currentUser = req.user!;
    const currentUserId = currentUser.id;
    const currentUserRole = currentUser.userRole;
    const userId = req.params.userId || currentUser.id;

    const user = await Users.findUnique({
        where: { id: userId },
    });

    if (!user) {
        const message = "user not found";
        const e = new CustomError(message, 404);
        return next(e);
    }

    const userRole = user.userRole;
    const havePermission = canAccess(userRole, currentUserRole);
    if (currentUserId === userId || havePermission) {
        req.user = getUserWithFormat(user);
        return next();
    } else {
        const permissionError = new CustomError("Access denied: insufficient permissions.", 403, {
            permission: "You are not allowed to access this user",
        });
        return next(permissionError);
    }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName } = req.body;
    let user = req.user!;

    if (req.params.userId) {
        const isValidUser = await Users.findUnique({ where: { id: req.params.userId } });

        if (!isValidUser) {
            const message = "user not found";
            const e = new CustomError(message, 404);
            return next(e);
        }
        user = isValidUser;
    }

    if (
        (user.firstName?.toLowerCase() === firstName.toLowerCase() &&
            user.lastName?.toLowerCase() === lastName.toLowerCase()) ||
        (!firstName && !lastName)
    ) {
        res.status(304).send();
        return;
    }
    req.newUser = user;

    next();
};

const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    const { currentPassword, newPassword } = req.body;
    const currentUser = req.user!;
    const currentUserId = currentUser.id;
    const user = await Users.findUnique({ where: { id: currentUserId } });
    if (!user) {
        const e = new CustomError("Expired token. Please log in again to continue.", 401);
        return next(e);
    }

    const isValidPassword = await comparePasswords(currentPassword, user.password);
    if (!isValidPassword) {
        const message = "Invalid current password";
        const e = new CustomError(message, 403);
        return next(e);
    }

    const passwordHash = await hashPassword(newPassword);
    req.body = { password: passwordHash };
    
    next();
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    const user = await Users.findUnique({ where: { id: userId }, include: { clinics: true } });
    if (!user) {
        const message = "user not found";
        const e = new CustomError(message, 404);
        next(e);
        return;
    }
    if (req.user?.userRole !== USER_ROLES.OWNER) {
        const message = "can't delete this user";
        const e = new CustomError(message, 403);
        next(e);
        return;
    }
    req.newUser = getUserWithFormat(user);
    next();
};

export { getUsers, getUser, update, changePassword, deleteUser };
