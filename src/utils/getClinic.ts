import { Users, Clinics } from "@prisma/client";
import { getUserWithFormat, getUserWithOutClinicWithFormat } from "./getUser";

export const getClinicWithFormat = (clinic: Clinics & { doctorOwner: Users }) => {
    const clinicWithFormat = {
        id: clinic.id,
        name: clinic.name,
        consultationFee: clinic.consultationFee,
        followUpFee: clinic.followUpFee,
        EXPIRATION_DAYS: clinic.EXPIRATION_DAYS,
        doctorOwner: getUserWithOutClinicWithFormat(clinic.doctorOwner),
    };
    return clinicWithFormat;
};

export const getClinicWithOutOwnerWithFormat = (clinic: Clinics) => {
    const clinicWithFormat = {
        id: clinic.id,
        name: clinic.name,
        consultationFee: clinic.consultationFee,
        followUpFee: clinic.followUpFee,
        EXPIRATION_DAYS: clinic.EXPIRATION_DAYS,
    };
    return clinicWithFormat;
};
