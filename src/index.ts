import userRouter from "./routers/userRouter";
import server from "./server";

const app = server;

app.use("/api/users", userRouter);
