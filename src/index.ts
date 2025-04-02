import userRouter from "./routers/userRouter";
import userAuth from "./routers/authUserRouter";
import server from "./server";

const app = server;

app.use("/api/users", userRouter);
app.use("/api/auth", userAuth);
