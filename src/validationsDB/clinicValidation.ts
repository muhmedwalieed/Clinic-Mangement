import { Request, Response, NextFunction } from "express";
import { prisma } from "../data/database";
import { USER_ROLES } from "@prisma/client";
import CustomError from "../utils/customError";
import { getClinicWithFormat } from "../utils/getClinic";
import { getUserWithOutClinicWithFormat } from "../utils/getUser";

const Clinics = prisma.clinics;
const Users = prisma.users;

const getClinics = async (req: Request, res: Response, next: NextFunction) => {};

const getClinic = async (req: Request, res: Response, next: NextFunction) => {
    const clinicId = req.params.clinicId;
    const clinic = await Clinics.findUnique({
        where: { id: clinicId },
        include: {
            doctorOwner: true,
        },
    });

    if (!clinic) {
        const message = "Clinic not found";
        const e = new CustomError(message, 404);
        next(e);
        return;
    }
    req.clinic = getClinicWithFormat(clinic);
    next();
};

const createClinic = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.newUser;
    if (user?.userRole !== USER_ROLES.DOCTOR) {
        const message = "Cannot create clinic for this user";
        const e = new CustomError(message, 403);
        return next(e);
    }
    next();
};

const updateClinic = async (req: Request, res: Response, next: NextFunction) => {
    const clinic = await Clinics.findFirst({ where: { doctorId: req.user?.id }, include: { doctorOwner: true } });
    const { name, consultationFee, followUpFee, EXPIRATION_DAYS } = req.body;
    if (!clinic) {
        const msg = "You don't have a clinic.For more information, please contact technical support.";
        const e = new CustomError(msg, 400);
        return next(e);
    }
    if (
        clinic?.name?.toLowerCase() === name?.toLowerCase() &&
        clinic?.consultationFee === consultationFee &&
        clinic?.followUpFee === followUpFee &&
        clinic?.EXPIRATION_DAYS === EXPIRATION_DAYS
    ) {
        res.status(304).send();
        return;
    }
    req.clinic = getClinicWithFormat(clinic);
    next();
};

const deleteClinic = async (req: Request, res: Response, next: NextFunction) => {
    const clinic = await Clinics.findUnique({
        where: { id: req.params.clinicId },
    });
    if (!clinic) {
        const message = "Clinic not found";
        const e = new CustomError(message, 404);
        next(e);
        return;
    }
    next();
};

export { getClinic, createClinic, updateClinic, deleteClinic };
