import { Request } from "express";
import { Users, Clinics } from "@prisma/client";

interface Iuser {
    id: string;
    firstName: string | null;
    lastName: string | null;
    username: string;
    userRole: string;
    profileCompleted: boolean;
}

interface Ipatient {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
}
interface Iclinic {
    id: string;
    name: string;
    consultationFee: number | null;
    followUpFee: number | null;
    EXPIRATION_DAYS: number | null;
    doctorOwner: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        username: string;
        userRole: string;
        profileCompleted: boolean;
    };
}

declare global {
    namespace Express {
        interface Request {
            user?: Iuser;
            newUser?: Iuser;
            clinic?: Iclinic;
            patient?: Ipatient;
            prismaQuery?: {
                [key: string]: any;
            };
        }
    }
}
