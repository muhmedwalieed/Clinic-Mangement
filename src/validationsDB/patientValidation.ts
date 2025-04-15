import { Request, Response, NextFunction } from "express";
import { prisma } from "../data/database";
import CustomError from "../utils/customError";

const Patients = prisma.patients;

const getPatient = async (req: Request, res: Response, next: NextFunction) => {
    const phone = req.params.phone;
    const clinicId = req.clinic?.id;
    const patient = await Patients.findFirst({
        where: {
            phone,
            historyOfConsultations: {
                some: {
                    clinicId: clinicId,
                },
            },
        },
        include: {
            historyOfConsultations: {
                include: {
                    followUp: true,
                },
            },
        },
    });
    if (!patient) {
        const message = "Patient Not found";
        const e = new CustomError(message, 404);
        next(e);
        return;
    }
    req.patient = patient;
    next();
};

const createPatient = async (req: Request, res: Response, next: NextFunction) => {
    const patient = await Patients.findUnique({ where: { phone: req.body.phone } });
    if (patient) {
        const message = "Patient already exists";
        const e = new CustomError(message, 403);
        return next(e);
    }
    const newPatient = await Patients.create({ data: req.body });
    req.patient = newPatient;
    next();
};

const validPatient = async (req: Request, res: Response, next: NextFunction) => {
    const { phone } = req.body;

    const patient = await Patients.findUnique({
        where: { phone },
    });

    if (patient) {
        const message = "Patient already exists";
        const e = new CustomError(message, 403);
        return next(e);
    }
    next();
};

export { getPatient, createPatient, validPatient };
