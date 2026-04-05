// import dotenv from "dotenv";
import "dotenv/config";
import express from "express";
import cors from "cors";

import { getUser, Login, Register, VerifyEmail } from "./controllers/auth";
import { authenticate } from "../middlewares/authenticate";

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

// AUTH
routerv1.post("/auth/register", Register);
routerv1.get("/auth/verify-email", VerifyEmail);
routerv1.post("/auth/login", Login);

// User
routerv1.get("/user", authenticate, getUser);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
