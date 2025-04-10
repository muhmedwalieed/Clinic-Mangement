import { Request, Response, NextFunction } from "express";
import { prisma } from "../data/database";
import CustomError from "../utils/customError";
import roleHierarchy from "../utils/roleHierarchy";
import { comparePasswords, hashPassword } from "../utils/hashUtils";
import { USER_ROLES } from "@prisma/client";

const Users = prisma.users;

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { username, userRole } = req.body;
    const currentUserRole = (req as any).user.userRole;
    const user = await Users.findUnique({ where: { username } });
    if (user) {
        const message = "Username already exists. Please choose another one.";
        const e = new CustomError(message, 409);
        next(e);
        return;
    }
    if (roleHierarchy[userRole] >= roleHierarchy[currentUserRole]) {
        const message = `You are not allowed to create a user with a higher role than your own.`;
        const e = new CustomError(message, 409);
        next(e);
        return;
    }
    if (!process.env.DEF_USER_PASSWORD) {
        const message = `Invalid server error`;
        console.error("DEF_USER_PASSWORD not found");
        const e = new CustomError(message, 409);
        next(e);
        return;
    }
    const password = process.env.DEF_USER_PASSWORD;
    req.body.password = await hashPassword(password);
    next();
};

const login = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    const isValidUsername = await Users.findUnique({
        where: { username },
        select: {
            id: true,
            username: true,
            isActive: true,
            password: true,
            userRole: true,
        },
    });

    if (!isValidUsername) {
        const message = "Invalid username or password";
        const e = new CustomError(message, 409);
        next(e);
        return;
    }

    const isValidPassword = await comparePasswords(
        password,
        isValidUsername.password
    );

    if (!isValidPassword) {
        const message = "Invalid username or password";
        const e = new CustomError(message, 409);
        next(e);
        return;
    }

    (req as any).user = isValidUsername;

    next();
};

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    const currentUserRole = (req as any).user.userRole;
    if (currentUserRole === USER_ROLES.OWNER) {
        (req as any).prismaQuery = {};
    } else {
        const allowedRoles = Object.keys(roleHierarchy).filter(
            (role) => roleHierarchy[role] < roleHierarchy[currentUserRole]
        );
        (req as any).prismaQuery = { userRole: { in: allowedRoles } };
    }
    next();
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    const currentUserId = (req as any).user.id;
    const currentUserRole = (req as any).user.userRole;

    const user = await Users.findUnique({
        where: { id: userId },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            isActive: true,
            userRole: true,
        },
    });

    if (!user) {
        const message = "user not found";
        const e = new CustomError(message, 403);
        next(e);
        return;
    }
    const getUserRole = user?.userRole || "";

    (req as any).user = user;

    if (currentUserId === userId || currentUserRole === USER_ROLES.OWNER) {
        next();
        return;
    } else if (roleHierarchy[currentUserRole] <= roleHierarchy[getUserRole]) {
        const message = "can't access this user";
        const e = new CustomError(message, 403);
        next(e);
        return;
    } else {
        next();
    }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName } = req.body;
    const currentUserId = (req as any).user.id;
    const user = await Users.findUnique({ where: { id: currentUserId } });

    if (
        (user?.firstName?.toLowerCase() === firstName.toLowerCase() &&
            (user as any)?.lastName.toLowerCase() === lastName.toLowerCase()) ||
        (!firstName && !lastName)
    ) {
        res.status(304).send();
        return;
    }
    (req as any).user = user;
    next();
};

const changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { currentPassword, newPassword } = req.body;
    const currentUserId = (req as any).user.id;
    const user = await Users.findUnique({ where: { id: currentUserId } });
    const isValidPassword = await comparePasswords(
        currentPassword,
        user?.password || ""
    );
    if (!isValidPassword) {
        const message = "Invalid current password";
        const e = new CustomError(message, 403);
        next(e);
        return;
    }
    const passwordHash = await hashPassword(newPassword);
    req.body = { password: passwordHash };
    next();
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const currentUserId = (req as any).user.id;
    const userId = req.params.userId;
    const user = await Users.findUnique({ where: { id: userId } });
    const currentUserRole = roleHierarchy[(req as any).user.userRole];
    const userRole = roleHierarchy[user?.userRole || ""];
    if (
        currentUserId !== userId ||
        userRole >= currentUserRole ||
        (req as any).user.userRole !== USER_ROLES.OWNER
    ) {
        const message = "can't delete this user";
        const e = new CustomError(message, 403);
        next(e);
        return;
    }
    next();
};

export {
    createUser,
    login,
    getUsers,
    getUser,
    update,
    changePassword,
    deleteUser,
};
