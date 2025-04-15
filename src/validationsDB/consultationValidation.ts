import { Request, Response, NextFunction } from "express";
import { prisma } from "../data/database";
import CustomError from "../utils/customError";
import { USER_ROLES } from "@prisma/client";
const Consultations = prisma.consultations;
const Users = prisma.users;
const Patients = prisma.patients;

const getConsultations = async (req: Request, res: Response, next: NextFunction) => {
    const currentUser = req.user;
    const user = await Users.findUnique({ where: { id: currentUser?.id }, select: { clinics: true } });
    const clinic = user?.clinics[0] || null;
    if (!clinic) {
        const message = "Sorry doctor but u don't have clinic";
        const e = new CustomError(message, 403);
        next(e);
        return;
    }
    const consultations = await Consultations.findMany({ where: { clinicId: clinic.id } });
    req.body = { consultations };
    next();
};

const getConsultation = async (req: Request, res: Response, next: NextFunction) => {
    const currentUser = req.user;
    const user = await Users.findUnique({ where: { id: currentUser?.id }, select: { clinics: true } });
    const clinic = user?.clinics[0] || null;
    if (!clinic) {
        const message = "Sorry doctor but u don't have clinic";
        const e = new CustomError(message, 403);
        next(e);
        return;
    } //i will update this
    const consultation = await Consultations.findUnique({ where: { id: req.params.consultationId } });
    req.body = { consultation };
    next();
};

const createConsultation = async (req: Request, res: Response, next: NextFunction) => {
    const patient = await Patients.findUnique({
        where: { id: req.params.patientId },
    });

    if (!patient) {
        const message = "Patient not found";
        const e = new CustomError(message, 404);
        return next(e);
    }
    req.patient = patient;
    next();
};

const updateConsultation = async (req: Request, res: Response, next: NextFunction) => {
    const { status, description } = req.body;
    const consultation = await Consultations.findUnique({ where: { id: req.params.consultationId } });
    if (!consultation) {
        const message = "Consultation not found";
        const e = new CustomError(message, 404);
        return next(e);
    }
    if (req.user?.userRole !== USER_ROLES.DOCTOR && description) {
        const message = "Doctor only can update description of consultation";
        const e = new CustomError(message, 404);
        return next(e);
    }
    if (consultation.description === description && consultation.status === status) {
        res.status(304).send();
        return;
    }
    next();
};

export { createConsultation, updateConsultation };
