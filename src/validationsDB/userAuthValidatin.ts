import { Request, Response, NextFunction } from "express";
import { prisma } from "../data/database";
import CustomError from "../utils/customError";
import roleHierarchy from "../utils/roleHierarchy";
import { comparePasswords, hashPassword } from "../utils/hashUtils";
import { USER_ROLES } from "@prisma/client";
import { getUserWithFormat } from "../utils/getUser";

const Users = prisma.users;

const validUser = async (id: string) => {
    const user = await Users.findUnique({ where: { id }, include: { clinics: true } });
    if (!user) {
        throw new Error("pls login again");
    }
    return user;
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { username, userRole } = req.body.validData;
    const currentUserRole = req.user?.userRole;
    const user = await Users.findUnique({ where: { username } });
    if (user) {
        const message = "Username already exists. Please choose another one.";
        const e = new CustomError(message, 409);
        next(e);
        return;
    }
    if (roleHierarchy[userRole] >= roleHierarchy[currentUserRole!]) {
        const message = `You are not allowed to create a user with a higher role than your own.`;
        const e = new CustomError(message, 409);
        next(e);
        return;
    }
    next();
};

const login = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    const isValidUsername = await Users.findUnique({
        where: { username },
        include: {
            clinics: true,
        },
    });

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

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.prismaQuery?.userRole;
    const currentUserRole = req.user?.userRole;
    if (userRole && req.prismaQuery && currentUserRole) {
        if (currentUserRole === USER_ROLES.OWNER) {
            req.prismaQuery.userRole = { in: [userRole] };
        } else if (roleHierarchy[userRole] < roleHierarchy[currentUserRole]) {
            req.prismaQuery.userRole = { in: [userRole] };
        } else {
            const allowedRoles = Object.keys(roleHierarchy).filter(
                (role) => roleHierarchy[role] < roleHierarchy[currentUserRole]
            );

            req.prismaQuery.userRole = { in: allowedRoles };
        }
    }
    if (req.prismaQuery?.username) {
        const user = await Users.findUnique({ where: { username: req.prismaQuery?.username }, select: { id: true } });
        if (!user) {
            const message = "Invalid data in the input field.";
            const e = new CustomError(message, 400,{username:"username not found"});
            return next(e);
        }
        req.prismaQuery["adminId"] = user?.id;
        delete req.prismaQuery?.username;
    }
    console.log(req.prismaQuery);

    next();
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    const currentUserId = req.user?.id;
    const currentUserRole = req.user?.userRole;

    const user = await Users.findUnique({
        where: { id: userId },
        include: {
            clinics: true,
        },
    });

    if (!user) {
        const message = "user not found";
        const e = new CustomError(message, 403);
        next(e);
        return;
    }
    const getUserRole = user?.userRole;

    req.user = getUserWithFormat(user);

    if (currentUserId === userId || currentUserRole === USER_ROLES.OWNER) {
        return next();
    } else if (roleHierarchy[currentUserRole!] <= roleHierarchy[getUserRole]) {
        const message = "can't access this user";
        const e = new CustomError(message, 403);
        return next(e);
    } else {
        next();
    }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName } = req.body;
    const currentUserId = req.user?.id;
    const user = await validUser(currentUserId!);
    if (
        (user.firstName?.toLowerCase() === firstName.toLowerCase() &&
            user.lastName?.toLowerCase() === lastName.toLowerCase()) ||
        (!firstName && !lastName)
    ) {
        res.status(304).send();
        return;
    }
    req.user = getUserWithFormat(user);
    next();
};

const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    const { currentPassword, newPassword } = req.body;
    const currentUserId = req.user?.id;
    const user = await validUser(currentUserId!);
    const isValidPassword = await comparePasswords(currentPassword, user?.password!);
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

export { createUser, login, getUsers, getUser, update, changePassword, deleteUser };
