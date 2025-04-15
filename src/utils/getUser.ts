import { Users, Clinics } from "@prisma/client";
import { getClinicWithOutOwnerWithFormat } from "./getClinic";

export const getUserWithFormat = (user: Users) => {
    const userWithFormat = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        profileCompleted: user.profileCompleted,
        userRole: user.userRole,
    };
    return userWithFormat;
};

export const getUserWithOutClinicWithFormat = (user: Users) => {
    const userWithFormat = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        profileCompleted: user.profileCompleted,
        userRole: user.userRole,
    };
    return userWithFormat;
};


export const getUserAndClinicWithFormat = (user: Users & { clinics: Clinics[] }) => {
    const userWithFormat = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        profileCompleted: user.profileCompleted,
        userRole: user.userRole,
        clinic: getClinicWithOutOwnerWithFormat(user.clinics[0]),
    };
    return userWithFormat;
};