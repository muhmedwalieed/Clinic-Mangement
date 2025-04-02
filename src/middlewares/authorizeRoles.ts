import { prisma } from "../data/database";
import { Request, Response, NextFunction } from "express";
import CustomError from "../utils/customError";

export const authorizeRoles = (allowedRoles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await prisma.users.findUnique({
                where: { id: (req as any).user.id },
                select: { userRole: true },
            });

            if (!user) {
                const e = new CustomError(
                    "User not found.",
                    404
                );
                next(e);
                return;
            }

            const userRole = user?.userRole.toUpperCase();
            const hasPermission = allowedRoles.some(
                (role) => role.toUpperCase() === userRole
            );

            if (!hasPermission) {
                const e = new CustomError(
                    "You do not have permission to access this resource.",
                    403
                );
                next(e);
                return;
            }
            (req as any).userRole = user?.userRole;
            next();
        } catch (error) {
            const e = new CustomError("Authorization failed.", 500);
            next(e);
        }
    };
};
