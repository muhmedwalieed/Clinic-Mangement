import { prisma } from "../data/database";
import { NextFunction, Request, Response } from "express";
import { createJWT } from "../utils/jwtUtils";
import { comparePasswords, hashPassword } from "../utils/hashUtils";
import CustomError from "../utils/customError";

const Users = prisma.users;

const isValidUsername = async (username: string) => {
    const isUsed = await Users.findUnique({ where: { username } });
    return isUsed ? false : true;
};

export const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    req.body.password = await hashPassword(process.env.DEF_USER_PASSWORD || "");
    const validUsername = await isValidUsername(req.body.username);
    if (!validUsername) {
        const e = new CustomError(
            "Username already exists. Please choose another one.",
            409
        );
        next(e);
        return;
    }
    delete req.body.role;
    const user = await Users.create({
        data: req.body,
    });
    res.json({
        status: "success",
        statusCode: 200,
        message: "user created successfully",
    });
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = await Users.findUnique({
        where: { username },
        select: {
            id: true,
            username: true,
            isActive: true,
            password: true,
            userRole: true,
        },
    });
    if (!user) {
        res.status(401).json("Invalid username or password");
        return;
    }
    const validPassowrd = await comparePasswords(password, user.password);
    if (!validPassowrd) {
        res.status(401).json("Invalid username or password");
        return;
    }
    const token = createJWT(user);
    const { password: _, ...userWithoutPassword } = user;
    const data = {
        status: "success",
        statusCode: 200,
        message: "user login success",
        user: userWithoutPassword,
        token,
    };
    res.json({
        success: "success",
        data,
    });
};

export const getUsers = async (req: Request, res: Response) => {
    const query = (req as any).validQuery;

    const users = await Users.findMany({
        where: query,
        select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            userRole: true,
        },
    });

    const usersCountByRole = await Users.groupBy({
        by: ["userRole"],
        where: query,
        _count: {
            id: true,
        },
    });
    const formattedCountByRole = usersCountByRole.map((item) => ({
        userRole: item.userRole,
        count: item._count.id,
    }));
    res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "succes get user information",
        data: { countByRole: formattedCountByRole, users },
    });
};

export const getUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const id = req.params.userId;
    const user = await Users.findUnique({
        where: { id },
        select: {
            id: true,
            username: true,
            isActive: true,
            firstName: true,
            lastName: true,
        },
    });
    if (!user) {
        const e = new CustomError("user not found.", 409);
        next(e);
        return;
    }
    res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "succes get user information",
        data: user,
    });
};

export const updateUser = async (req: Request, res: Response) => {
    const { firstName, lastName } = req.body;
    const id = (req as any).user.id;
    const user = await Users.update({
        where: { id },
        data: { firstName, lastName },
        select: {
            id: true,
            username: true,
            isActive: true,
            firstName: true,
            lastName: true,
        },
    });
    res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "succes update user information",
        data: user,
    });
    res.json({ data: user });
};

export const updatePassword = async (req: Request, res: Response) => {
    const id = (req as any).user.id;
    const { newPassword } = req.body;
    const password = await hashPassword(newPassword);
    const user = await Users.update({ where: { id }, data: { password } });
    res.json({
        status: "success",
        message: "updated",
    });
};

export const deleteUser = async (req: Request, res: Response) => {
    const id = req.params.userId;
    await Users.delete({ where: { id } });
    res.json({
        status: "success",
        message: "deleted",
    });
};
