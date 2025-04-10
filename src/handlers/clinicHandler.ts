import { Request, Response } from "express";
import { prisma } from "../data/database";
const Clinics = prisma.clinics;

const getClinic = async (req: Request, res: Response) => {
    const clinic = req.body.clinic;
    res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "succes get clinic information",
        data: { clinic },
    });
};

const getClinics = async (req: Request, res: Response) => {
    const clinics = await Clinics.findMany();
    res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "succes get clinics information",
        data: { clinics },
    });
};

const createClinic = async (req: Request, res: Response) => {
    const newClinic = await Clinics.create({
        data: {
            name: req.body.name,
            doctorId: req.body.doctorId,
            adminId: (req as any).user.id,
        },
    });
    res.json({
        status: "success",
        statusCode: 200,
        message: "clinic created successfully",
        data: {
            clinicId: newClinic.id,
            clinicName: newClinic.name,
        },
    });
};

const updateClinic = async (req: Request, res: Response) => {
    const updateClinic = await Clinics.update({
        where: { id: req.params.clinicId },
        data: req.body,
    });
    res.json({
        status: "success",
        message: "updated",
    });
};

const deleteClinic = async (req: Request, res: Response) => {
    await Clinics.delete({ where: { id: req.params.clinicId } });
    res.json({
        status: "success",
        message: "deleted",
    });
};

export { getClinic, getClinics, createClinic, updateClinic, deleteClinic };
