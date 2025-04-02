import userRouter from "./routers/userRouter";
import userAuth from "./routers/authUserRouter";
import server from "./server";

const app = server;

app.get("/",(req,res)=>{
    res.send("<h1>Hello World</h1>")
})
app.use("/api/users", userRouter);
app.use("/api/auth", userAuth);
