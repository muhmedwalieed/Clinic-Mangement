import { Request, Response } from "express";
import { prisma } from "../data/database";
import { USER_ROLES } from "@prisma/client";
const Consultations = prisma.consultations;

const getConsultation = async (req: Request, res: Response) => {
    const consultationId = req.params.consultationId;
    const clinic = req.clinic!;

    const consultation = await Consultations.findUnique({
        where: {
            id_clinicId: {
                id: consultationId,
                clinicId: clinic.id,
            },
        },
        select: {
            id: true,
            price: true,
            status: true,
            createdAt: true,
            followUp: {
                select: {
                    status: true,
                },
            },
            patient: true,
        },
    });

    if (!consultation) {
        console.log("Nope");
    }
    res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "succes get consultation information",
        data: { consultation },
    });
};

const getConsultations = async (req: Request, res: Response) => {
    const clinic = req.clinic;
    const consultations = await Consultations.findMany({
        where: { clinicId: clinic?.id },
        select: {
            id: true,
            price: true,
            status: true,
            createdAt: true,
            followUp: {
                select: {
                    status: true,
                },
            },
            patient: true,
        },
    });

    res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "succes get consultations information",
        data: { consultations },
    });
};

const createConsultation = async (req: Request, res: Response) => {
    const clinic = req.clinic;
    const patient = req.patient;
    const newConsultation = await Consultations.create({
        data: {
            price: clinic?.consultationFee!,
            patientId: patient?.id!,
            clinicId: clinic?.id!,
        },
    });
    res.json({
        status: "success",
        statusCode: 200,
        message: "Consultation created successfully",
        Consultation: newConsultation,
    });
};

const updateConsultation = async (req: Request, res: Response) => {
    const userRole = req.user?.userRole;
    const updateConsultation = await Consultations.update({
        where: { id: req.params.consultationId },
        data: req.body,
        select: {
            id: true,
            price: true,
            status: true,
            createdAt: true,
            followUp: {
                select: {
                    status: true,
                },
            },
            patient: true,
            description: userRole === USER_ROLES.DOCTOR,
        },
    });
    res.json({
        status: "success",
        message: "updated",
        data: updateConsultation,
    });
};

const deleteConsultation = async (req: Request, res: Response) => {
    await Consultations.delete({ where: { id: req.params.clinicId } });
    res.json({
        status: "success",
        message: "deleted",
    });
};

export { getConsultation, getConsultations, createConsultation, updateConsultation, deleteConsultation };
