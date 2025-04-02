import { prisma } from "../data/database";
import { NextFunction, Request, Response } from "express";
import { createJWT } from "../utils/jwtUtils";
import { comparePasswords, hashPassword } from "../utils/hashUtils";
import CustomError from "../utils/customError";

const Users = prisma.users;

const createUser = async (req: Request, res: Response) => {
    const user = await Users.create({
        data: req.body,
    });
    res.json({
        status: "success",
        statusCode: 200,
        message: "user created successfully",
    });
};

const login = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const token = createJWT(user);
    const data = {
        statusCode: 200,
        message: "user login success",
        user: {
            id: user.id,
            username: user.username,
            isActive: user.isActive,
            userRole: user.userRole,
        },
        token,
    };
    res.json({
        status: "success",
        data,
    });
};

const getUsers = async (req: Request, res: Response) => {
    const query = (req as any).prismaQuery;
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
    const count = await Users.count({ where: query });
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
        data: { count, countByRole: formattedCountByRole, users },
    });
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "succes get user information",
        data: user,
    });
};

const updateUser = async (req: Request, res: Response) => {
    const id = (req as any).user.id;
    const user = await Users.update({
        where: { id },
        data: req.body,
        select: {
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

const updatePassword = async (req: Request, res: Response) => {
    const id = (req as any).user.id;
    const { newPassword } = req.body;
    const password = await hashPassword(newPassword);
    const user = await Users.update({ where: { id }, data: { password } });
    res.json({
        status: "success",
        message: "updated",
    });
};

const deleteUser = async (req: Request, res: Response) => {
    const id = req.params.userId;
    await Users.delete({ where: { id } });
    res.json({
        status: "success",
        message: "deleted",
    });
};

export {
    createUser,
    login,
    getUsers,
    getUser,
    updateUser,
    updatePassword,
    deleteUser,
};
