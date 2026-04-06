// import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function getAllUsersService(role: string, page: number, limit: number) {
  if (role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  const skip = (page - 1) * limit
  const total = await prisma.user.count()

  const users = await prisma.user.findMany({
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
  })

  return {
    data: users,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }
}

export { getAllUsersService };
