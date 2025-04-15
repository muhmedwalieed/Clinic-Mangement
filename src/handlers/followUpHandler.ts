import { Request, Response } from "express";
import { prisma } from "../data/database";
const FollowUps = prisma.followUps;

const getFollowUp = async (req: Request, res: Response) => {
    const followUp = req.body.followUp;
    res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "succes get clinic information",
        data: { followUp },
    });
};

const getFollowUps = async (req: Request, res: Response) => {
    const followUps = await FollowUps.findMany();
    res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "succes get clinics information",
        data: { followUps },
    });
};

const createFollowUp = async (req: Request, res: Response) => {
    const newFollowUp = await FollowUps.create({
        data: req.body,
    });
    res.json({
        status: "success",
        statusCode: 200,
        message: "clinic created successfully",
        data: newFollowUp,
    });
};

const updateFollowUp = async (req: Request, res: Response) => {
    const updateFollowUp = await FollowUps.update({
        where: { id: req.params.clinicId },
        data: req.body,
    });
    res.json({
        status: "success",
        message: "updated",
    });
};

const deleteFollowUp = async (req: Request, res: Response) => {
    await FollowUps.delete({ where: { id: req.params.clinicId } });
    res.json({
        status: "success",
        message: "deleted",
    });
};

export { getFollowUp, getFollowUps, createFollowUp, updateFollowUp, deleteFollowUp };
