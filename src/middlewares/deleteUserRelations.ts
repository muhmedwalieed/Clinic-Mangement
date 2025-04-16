// middlewares/deleteUserRelations.ts

import { Request, Response, NextFunction } from "express";
import { prisma } from "../data/database";
import CustomError from "../utils/customError";

const Consultations = prisma.consultations;
const Patients = prisma.patients;
export const deleteUserRelations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const clinic = req.clinic;
        if (!clinic) {
            return next();
        }
        await Patients.deleteMany({
            where: {
                historyOfConsultations: {
                    some: {
                        clinicId: clinic.id,
                    },
                },
            },
        });
        await Consultations.findMany({
            where: {
                clinic: {
                    id: clinic.id ?? "",
                },
            },
        });
        await prisma.clinics.deleteMany({
            where: {
                id: clinic.id,
            },
        });

        next();
    } catch (err) {
        return next(new CustomError("Error while deleting related data", 500));
    }
};
