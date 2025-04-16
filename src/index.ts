import userRouter from "./routers/userRouter";
import userAuth from "./routers/userAuthRouter";
import clinicRouter from "./routers/clinicRouter";
import server from "./server";
import consultationRouter from "./routers/consultationRouter";
import followUpRouter from "./routers/followUpRouter";
import patientRouter from "./routers/patientRouter";
import { checkUserProfile } from "./middlewares/ValidUser";
import { protect } from "./utils/jwtUtils";
import { globalErrorHandel } from "./middlewares/globalErrorHandel";
import { isHaveClinic } from "./middlewares/DoctorHaveClinic";
import { USER_ROLES } from "@prisma/client";
import { authorizeRoles } from "./middlewares/authorizeRoles";
import "./cronJobs/updateExpiredConsultations";
const app = server;

app.get("/", (req, res) => {
    res.send("<h1>Hello World</h1>");
});
app.use("/api/auth", userAuth);
app.use("/api/users", protect, userRouter);
app.use("/api/clinics", protect, checkUserProfile, clinicRouter);
app.use("/api/patients", protect, checkUserProfile, patientRouter);
app.use(
    "/api/consultations",
    protect,
    checkUserProfile,
    authorizeRoles([USER_ROLES.DOCTOR, USER_ROLES.NURSE]),
    isHaveClinic,
    consultationRouter
);
app.use(
    "/api/follow-up",
    protect,
    checkUserProfile,
    authorizeRoles([USER_ROLES.DOCTOR, USER_ROLES.NURSE]),
    isHaveClinic,
    followUpRouter
);
app.use(globalErrorHandel);
