// import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

import { RegisterRequest } from "../types/auth";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function registerService(dto: RegisterRequest) {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);
    dto.password = hashedPassword;
    console.log(dto);
    return await prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        full_name: dto.full_name,
        password: dto.password,
        sex: dto.sex,
        religion: dto.religion,
        address: dto.address,
      },
    });
  } catch (error) {
    throw new String(error);
  }
}

export { registerService };
