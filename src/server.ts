import express from "express";
import dotenv  from "dotenv"
import cors from "cors";

dotenv .config()

const app = express();
const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app