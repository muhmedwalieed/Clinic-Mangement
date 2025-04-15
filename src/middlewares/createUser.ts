import { Request, Response, NextFunction } from "express";
import { prisma } from "../data/database";
import { USER_ROLES } from "@prisma/client";
import { hashPassword } from "../utils/hashUtils";
import { getUserWithFormat } from "../utils/getUser";

const Users = prisma.users;

export const createUser = (userRole: USER_ROLES) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const password = process.env.DEF_USER_PASSWORD;
        const passwordHash = await hashPassword(password!);

        const user = await Users.create({
            data: {
                username: req.body.validData.username!,
                userRole: userRole,
                password: passwordHash,
                adminId:req.user?.id
            },
            include: {
                clinics: true,
            },
        });

        req.newUser = getUserWithFormat(user);
        next();
    };
};
