import { Users } from "@prisma/client";

const roleOrder = {
    OWNER: 0,
    ADMIN: 1,
    DOCTOR: 2,
    NURSE: 3,
};

const sortUsersByRole = (users: Users[]) => {
    return users.sort((a, b) => {
        return roleOrder[a.userRole] - roleOrder[b.userRole];
    });
};

export { sortUsersByRole };
