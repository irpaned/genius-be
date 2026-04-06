import "dotenv/config";
import express from "express";
import cors from "cors";

import { Login, Register, VerifyEmail } from "./controllers/auth";
import { authenticate } from "../middlewares/authenticate";
import { getUser } from "./controllers/user";
import { getAllUsers, getUserDetail } from "./controllers/admin";

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

// USER
routerv1.get("/user", authenticate, getUser); // for the user himself to see his data

// ADMIN
routerv1.get("/users/:id", authenticate, getUserDetail); // for admin to see detail user
routerv1.get("/users", authenticate, getAllUsers); // for admin to see all users (table user)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
