import { Request, Response, NextFunction } from "express";
import { prisma } from "../data/database";
import CustomError from "../utils/customError";
import roleHierarchy from "../utils/roleHierarchy";
import { comparePasswords, hashPassword } from "../utils/hashUtils";
import { USER_ROLES } from "@prisma/client";
import { getUserWithFormat } from "../utils/getUser";

const Users = prisma.users;

const validUser = async (username: string) => {
    const user = await Users.findUnique({ where: { username } });
    return !!user;
};

const getUser = async (username: string) => {
    const user = await Users.findUnique({ where: { username } });
    return user;
};

const canAccess = (targetUserRole: string, actingUserRole: string) => {
    return roleHierarchy[actingUserRole] > roleHierarchy[targetUserRole] || actingUserRole === USER_ROLES.OWNER;
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { username, userRole } = req.body;
    const currentUserRole = req.user?.userRole!;

    const user = await validUser(username);

    if (user) {
        const message = "Username already exists. Please choose another one.";
        const e = new CustomError(message, 409);
        return next(e);
    }

    const havePermission = canAccess(userRole, currentUserRole);
    if (!havePermission) {
        const message = `You are not allowed to create a user with a higher role than your own.`;
        const e = new CustomError(message, 409);
        return next(e);
    }

    const password = process.env.DEF_USER_PASSWORD;
    const passwordHash = await hashPassword(password!);

    req.body.password = passwordHash;
    req.body.adminId = req.user?.id;

    next();
};

const login = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    const isValidUsername = await getUser(username);

    if (!isValidUsername) {
        const message = "Invalid username or password";
        const e = new CustomError(message, 409);
        next(e);
        return;
    }

    const isValidPassword = await comparePasswords(password, isValidUsername.password);

    if (!isValidPassword) {
        const message = "Invalid username or password";
        const e = new CustomError(message, 409);
        next(e);
        return;
    }

    req.user = getUserWithFormat(isValidUsername);

    next();
};

export { createUser, login };
