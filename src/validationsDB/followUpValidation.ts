import { Request, Response, NextFunction } from "express";
import { prisma } from "../data/database";
import CustomError from "../utils/customError";
import { STATUSFOLLOWUP, USER_ROLES } from "@prisma/client";
const Consultations = prisma.consultations;

const checkValidConsultation = async (consultationId: string, expirationDays: number, createdAt: Date) => {
    const cutoffDate = new Date(new Date(createdAt).getTime() + expirationDays * 24 * 60 * 60 * 1000);
    if (new Date() >= cutoffDate) {
        await Consultations.update({
            where: { id: consultationId },
            data: { followUpStatus: STATUSFOLLOWUP.expired },
        });
        return false;
    }
    return true;
};

const createFollowUp = async (req: Request, res: Response, next: NextFunction) => {
    const { consultationId } = req.body;
    const consultation = await Consultations.findUnique({
        where: { id: consultationId },
        select: {
            clinic: {
                select: {
                    EXPIRATION_DAYS: true,
                    followUpFee: true,
                },
            },
            followUp: true,
            followUpStatus: true,
            createdAt: true,
        },
    });

    if (!consultation) {
        const message = "Consultation not found";
        const e = new CustomError(message, 403);
        return next(e);
    }

    if (consultation.followUp) {
        const message = "You can't create follow up because this consultation have already follow up";
        const e = new CustomError(message, 403);
        return next(e);
    }

    if (consultation.followUpStatus === STATUSFOLLOWUP.expired) {
        const message = "Follow up has expired";
        const e = new CustomError(message, 403);
        return next(e);
    }

    const isValidConsultation = await checkValidConsultation(
        consultationId,
        consultation.clinic.EXPIRATION_DAYS!,
        consultation.createdAt
    );
    if (!isValidConsultation) {
        const message = "Follow up has expired";
        const e = new CustomError(message, 403);
        return next(e);
    }
    req.body.price=consultation.clinic.followUpFee
    console.log(req.body)
    next();
};

export { createFollowUp };
