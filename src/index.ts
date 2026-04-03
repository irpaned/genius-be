// import dotenv from "dotenv";
import "dotenv/config";
import express from "express";
import cors from "cors";
import { Register } from "./controllers/auth";

// dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const routerv1 = express.Router();

app.use(cors());
app.use(express.json());
app.use("/api/v1", routerv1);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

routerv1.post("/register", Register);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
