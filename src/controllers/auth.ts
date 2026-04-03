import { Request, Response } from "express";
import { registerService } from "../services/auth";

export async function Register(req: Request, res: Response) {
  try {
    console.log("test");
    const body = req.body;
    const user = await registerService(body);
    console.log(user);
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
