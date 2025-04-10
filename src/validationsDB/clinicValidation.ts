import { Request, Response, NextFunction } from "express";
import { prisma } from "../data/database";
import { USER_ROLES } from "@prisma/client";
import CustomError from "../utils/customError";

const Clinics = prisma.clinics;
const Users = prisma.users;

const getClinic = async (req: Request, res: Response, next: NextFunction) => {
    const clinicId = req.params.clinicId;
    const clinic = await Clinics.findUnique({ where: { id: clinicId } });

    if (!clinic) {
        const message = "Clinic not found";
        const e = new CustomError(message, 404);
        next(e);
        return;
    }
    req.body = { clinic };
    next();
};

const createClinic = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { doctorId } = req.body;
    const user = await Users.findUnique({
        where: { id: doctorId },
        select: { clinics: true, userRole: true },
    });
    if (user?.userRole !== USER_ROLES.DOCTOR) {
        const message = "Cannot create clinic for this user";
        const e = new CustomError(message, 403);
        next(e);
        return;
    }
    if (user.clinics.length >= 1) {
        const message = "User can only own one clinic";
        const e = new CustomError(message, 409);
        next(e);
        return;
    }
    next();
};

const updateClinic = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const clinicId = req.params.clinicId;
    const { name, consultationFee, followUpFee } = req.body;
    const isAllEmpty = [name, consultationFee, followUpFee].every(
        (val) => val === undefined || val === null
    );
    if (isAllEmpty) {
        res.status(304).send();
        return;
    }
    const clinic = await Clinics.findUnique({ where: { id: clinicId } });

    if (!clinic) {
        const message = "Clinic not found";
        const e = new CustomError(message, 404);
        next(e);
        return;
    }

    if (
        clinic?.name?.toLowerCase() === name?.toLowerCase() &&
        clinic?.consultationFee === consultationFee &&
        clinic?.followUpFee === followUpFee
    ) {
        res.status(304).send();
        return;
    }
    next();
};

const deleteClinic = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
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
