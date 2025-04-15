import { Request, Response } from "express";
import { prisma } from "../data/database";
import { getClinicWithFormat } from "../utils/getClinic";
const Clinics = prisma.clinics;

const getClinic = async (req: Request, res: Response) => {
    const clinic = req.clinic;
    res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "succes get clinic information",
        data: clinic,
    });
};

const getClinics = async (req: Request, res: Response) => {
    const clinics = await Clinics.findMany({
        where: req.prismaQuery,
        include: {
            doctorOwner: true,
        },
    });
    const clinicsWithFormat = clinics.map(getClinicWithFormat);
    res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "succes get clinics information",
        data: {
            count:clinicsWithFormat.length,
            clinics:clinicsWithFormat
        },
    });
};

const createClinic = async (req: Request, res: Response) => {
    const currentUser = req.user;
    const newUser = req.newUser;
    const newClinic = await Clinics.create({
        data: {
            name: req.body.name,
            doctorId: newUser?.id!,
            adminId: currentUser?.id!,
        },
    });
    res.json({
        status: "success",
        statusCode: 200,
        message: "clinic created successfully",
        data: {
            user: req.newUser,
            clinic: {
                clinicId: newClinic.id,
                clinicName: newClinic.name,
            },
        },
    });
};

const updateClinic = async (req: Request, res: Response) => {
    const updateClinic = await Clinics.update({
        where: { id: req.clinic?.id },
        data: req.body,
    });
    res.json({
        status: "success",
        message: "updated",
        data: updateClinic,
    });
};

const deleteClinic = async (req: Request, res: Response) => {
    const clinic = await Clinics.delete({ where: { id: req.params.clinicId } });
    res.json({
        status: "success",
        message: "deleted",
    });
};

export { getClinic, getClinics, createClinic, updateClinic, deleteClinic };
