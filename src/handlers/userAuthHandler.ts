import { prisma } from "../data/database";
import { Request, Response } from "express";
import { createJWT } from "../utils/jwtUtils";
import { getUserWithFormat } from "../utils/getUser";

const Users = prisma.users;

const createUser = async (req: Request, res: Response) => {
    const user = await Users.create({
        data: req.body,
    });
    const usersWithFormat = getUserWithFormat(user);
    res.json({
        status: "success",
        statusCode: 200,
        message: "user created successfully",
        data: { user: usersWithFormat },
    });
};

const login = async (req: Request, res: Response) => {
    const user = req.user;
    const token = createJWT(user!);
    res.json({
        status: "success",
        statusCode: 200,
        message: "user login success",
        data: {
            user,
            token,
        },
    });
};

export { createUser, login };
