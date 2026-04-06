import { Request, Response } from "express";
import { getUserService } from "../services/user";
import { successResponse, errorResponse } from "../utils/response";
import { getAllUsersService } from "../services/admin";

// for admin to see detail user
export async function getUserDetail(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const response = await getUserService(id as string);
    return successResponse(res, response, "Berhasil mengambil data user");
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Gagal mengambil data user", 400);
  }
}

// for admin to see all users
export async function getAllUsers(req: Request, res: Response) {
  try {
    const user = res.locals.user
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10

    const response = await getAllUsersService(user.role, page, limit)
    return successResponse(res, response, 'Berhasil mengambil semua user')
  } catch (error) {
    console.error(error)
    return errorResponse(res, (error as Error).message, 400)
  }
}
