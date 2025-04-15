import { NextFunction, Request, Response } from "express";
import CustomError from "../utils/customError";
import { prisma } from "../data/database";
import { comparePasswords } from "../utils/hashUtils";
import { error } from "console";
import { lstat } from "fs";
import { getUserWithFormat } from "../utils/getUser";

const Users = prisma.users;

export const checkUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) {
        const e = new CustomError("Expired token. Please log in again to continue.", 401);
        return next(e);
    }
    const user = await Users.findUnique({
        where: { id: userId },
        include: {
            clinics: true,
        },
    });
    if (!user) {
        const msg = "This account has not found. For more information, please contact technical support.";
        const e = new CustomError(msg, 401);
        return next(e);
    }
    if (!user.profileCompleted) {
        await validateUserProfile(user, next);
    }
    req.user = getUserWithFormat(user);
    next();
};

const validateUserProfile = async (user: any, next: NextFunction) => {
    const defaultPassword = process.env.DEF_USER_PASSWORD;

    const isIncomplete = [user.firstName, user.lastName].some((val) => !val || val.trim() === "");
    const errors: { [key: string]: string } = {};
    if (isIncomplete) {
        errors["firstName"] = !user.firstName ? "First name is required" : "";
        errors["lastName"] = !user.lastName ? "Last name is required" : "";
    }

    if (!defaultPassword) {
        return next(new CustomError("Server configuration error: default password not set", 500));
    }
    const isUsingDefaultPassword = await comparePasswords(defaultPassword, user.password);
    if (isUsingDefaultPassword) {
        errors["password"] = "You are using the default password, please change it for better security.";
    }

    if (Object.keys(errors).length > 0) {
        const msg = "Please complete your profile information";
        const e = new CustomError(msg, 400, errors);
        return next(e);
    }
    await prisma.users.update({
        where: { id: user.id },
        data: { profileCompleted: true },
    });
};
