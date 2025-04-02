import { Request, Response, NextFunction } from "express";
import { prisma } from "../data/database";
import CustomError from "../utils/customError";
import roleHierarchy from "../utils/roleHierarchy";
import { comparePasswords, hashPassword } from "../utils/hashUtils";

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
    const password = process.env.DEF_USER_PASSWORD || "";
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

export { createUser, login };
