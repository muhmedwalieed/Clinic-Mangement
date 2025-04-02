import { USER_ROLES } from "@prisma/client";

const roleHierarchy: Record<string, number> = {
    [USER_ROLES.OWNER]: 3,
    [USER_ROLES.ADMIN]: 2,
    [USER_ROLES.DOCTOR]: 1,
    [USER_ROLES.NURSE]: 0,
};

export default roleHierarchy;
