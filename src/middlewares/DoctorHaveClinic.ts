import { NextFunction, Request, Response } from "express";
import CustomError from "../utils/customError";
import { prisma } from "../data/database";
import { getClinicWithFormat, getClinicWithOutOwnerWithFormat } from "../utils/getClinic";

const Clinics=prisma.clinics

export const isHaveClinic = async (req: Request, res: Response, next: NextFunction) => {
    const clinic=await Clinics.findFirst({where:{doctorId:req.user?.id},include:{doctorOwner:true}})
    if (!clinic) {
        const msg = "You don't have a clinic.For more information, please contact technical support.";
        const e = new CustomError(msg, 400);
        return next(e);
    }
    if (!clinic.consultationFee || !clinic.followUpFee||!clinic.EXPIRATION_DAYS) {
        const msg = "Please complete your clinic information";
        const errors = {
            consultationFee: "Consultation Fee is required",
            followUpFee: "Follow-Up Fee is required",
            EXPIRATION_DAYS:"EXPIRATION_DAYS is required"
        };
        const e = new CustomError(msg, 400, errors);
        return next(e);
    }
    req.clinic=getClinicWithFormat(clinic)
    next();
};
