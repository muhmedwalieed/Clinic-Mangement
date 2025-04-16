import { prisma } from "../data/database";
import { NextFunction, Request, Response } from "express";
import { createJWT } from "../utils/jwtUtils";
import { comparePasswords, hashPassword } from "../utils/hashUtils";
import CustomError from "../utils/customError";
import { getUserWithFormat } from "../utils/getUser";
import { sortUsersByRole } from "../utils/sortedUsers";

const Users = prisma.users;

const getUsers = async (req: Request, res: Response) => {
    const query = req.prismaQuery;
    const users = await Users.findMany({
        where: query,
    });

    const sortedUsers = sortUsersByRole(users)
    const usersWithFormat = sortedUsers.map(getUserWithFormat);
    const count = users.length;
    res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "succes get users information",
        data: { count, users: usersWithFormat },
    });
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "succes get user information",
        data: { user },
    });
};

const updateUser = async (req: Request, res: Response) => {
    const id = req.newUser!.id;
    const user = await Users.update({
        where: { id },
        data: req.body,
        select: {
            firstName: true,
            lastName: true,
            username: true,
        },
    });
    res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "succes update user information",
        data: user,
    });
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

const checkUser = async (req: Request, res: Response) => {
    const user = await Users.findUnique({ where: { username: req.body.username } });
    res.json({
        exists: !!user,
    });
};

export { getUsers, getUser, updateUser, updatePassword, deleteUser, checkUser };
