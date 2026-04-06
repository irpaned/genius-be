import { Request, Response } from "express";
import { getUserService } from "../services/user";
import { errorResponse, successResponse } from "../utils/response";

// for the user himself
export async function getUser(req: Request, res: Response) {
  try {
    const user = res.locals.user;
    const response = await getUserService(user.id);
    return successResponse(res, response, "Berhasil mengambil data user");
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Gagal mengambil data user", 400);
  }
}
