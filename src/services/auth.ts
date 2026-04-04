// import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import jwt from "jsonwebtoken";
import { CustomJwtPayload, LoginRequest, RegisterRequest } from "../types/auth";
import { JwtPayload } from "jsonwebtoken";
import crypto from "crypto";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function registerService(dto: RegisterRequest) {
  try {
    const hashedPassword = await bcrypt.hash(dto.password, 13);

    console.log(dto);
    return await prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
      },
    });
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

async function createEmailVerificationService(
  token: string,
  userId: string,
  expiresAt: Date,
) {
  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    return await prisma.emailVerificationToken.create({
      data: {
        token: hashedToken,
        expiresAt,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  } catch (error) {
    throw new String(error);
  }
}

async function verifyEmailService(token: string) {
  try {
    // Check if the token is for email verification
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as CustomJwtPayload;
    if (decoded.purpose !== "email_verification") {
      throw new Error("Invalid token purpose");
    }

    console.log("passed 1");

    // Find the token record and include the associated user
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const record = await prisma.emailVerificationToken.findUnique({
      where: { token: hashedToken },
      include: { user: true },
    });

    console.log("passed 2", record);

    // Check if the token exists and is not expired
    if (!record) {
      throw new Error("Invalid token");
    } else {
      console.log("token exists");
    }
    if (record.expiresAt < new Date()) {
      throw new Error("Token expired");
    } else {
      console.log("token is valid");
    }
    if (record.user.isVerified) {
      throw new Error("User already verified");
    } else {
      console.log("user is not verified yet");
    }

    // Update the user's isVerified field to true and delete the token
    const user = record?.user.id;
    const result = await prisma.$transaction([
      prisma.user.update({
        where: { id: user },
        data: { isVerified: true },
      }),
      prisma.emailVerificationToken.delete({
        where: { token: hashedToken },
      }),
    ]);

    console.log("result[0]", result[0]);

    return result[0]; // Return the user update result
  } catch (error) {
    throw new String(error);
  }
}

async function loginService(dto: LoginRequest) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.isVerified) {
      throw new Error("Email not verified");
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    delete user.password;

    const jwtSecret = process.env.JWT_SECRET;

    const token = jwt.sign(user, jwtSecret);

    return { token, user };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export {
  registerService,
  createEmailVerificationService,
  verifyEmailService,
  loginService,
};
