import { NextFunction, Request, Response } from "express";
import { prisma } from "../data/database";
import { nextTick } from "process";
import CustomError from "../utils/customError";

const Patients = prisma.patients;

const getPatient = async (req: Request, res: Response) => {
    const patient = req.patient;
    res.json({
        status: "success",
        statusCode: 200,
        message: "Patient created successfully",
        data: patient,
    });
};

const createPatient = async (req: Request, res: Response) => {
    const newPatient = await Patients.create({
        data: req.body,
    });
    res.json({
        status: "success",
        statusCode: 200,
        message: "Patient created successfully",
        data: newPatient,
    });
};

const checkPhoneExists = async (req: Request, res: Response) => {
    const { phone } = req.body;

    const patient = await Patients.findUnique({
        where: { phone },
    });

    res.json({
        exists: !!patient,
    });
};

const validPhone = async (req: Request, res: Response, next: NextFunction) => {
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

export { getPatient, createPatient, checkPhoneExists, validPhone };
