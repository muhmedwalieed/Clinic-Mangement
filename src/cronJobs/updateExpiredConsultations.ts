import cron from "node-cron";
import { prisma } from "../data/database";
import { STATUSFOLLOWUP } from "@prisma/client";

const Consultations = prisma.consultations;
const updateExpiredConsultations = async () => {
    const now = new Date();

    const consultationsWithClinic = await Consultations.findMany({
        where: {
            followUpStatus: {
                not: STATUSFOLLOWUP.expired,
            },
        },
        include: {
            clinic: true,
        },
    });

    for (const consultation of consultationsWithClinic) {
        const { clinic, createdAt } = consultation;
        const expirationDays = clinic?.EXPIRATION_DAYS!;

        const cutoffDate = new Date(new Date(createdAt).getTime() + expirationDays * 24 * 60 * 60 * 1000);

        if (new Date() >= cutoffDate) {
            await Consultations.update({
                where: { id: consultation.id },
                data: { followUpStatus: STATUSFOLLOWUP.expired },
            });

            console.log(`[Cron Job] Consultation ${consultation.id} marked as expired.`);
        }
    }

    console.log(`[Cron Job] Finished running at ${now.toLocaleString("en-EG", { timeZone: "Africa/Cairo" })}`);
};

cron.schedule("0 0 * * *", updateExpiredConsultations, {
    timezone: "Africa/Cairo",
});
