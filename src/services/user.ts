// import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function getUserService(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      // include: {enrollments : true}
    });

    return user;
  } catch (error) {}
}


export { getUserService, getAllUsersService };
