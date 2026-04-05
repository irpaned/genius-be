import { Request, Response } from "express";
import {
  createEmailVerificationService,
  getUserService,
  loginService,
  registerService,
  verifyEmailService,
} from "../services/auth";
import jwt from "jsonwebtoken";
import { transporter } from "../../libs/nodemailer";

export async function Register(req: Request, res: Response) {
  try {
    console.log("test");
    // 1. Create user
    const response = await registerService(req.body);
    const userId = response.id;
    console.log(response);

    // 2. Create email verification token
    const token = jwt.sign(
      {
        userId: userId,
        purpose: "email_verification",
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h", // atau 24h untuk email verification
      },
    );

    // 3. Send verification email
    const fullUrl = req.protocol + "://" + req.get("host");
    const info = await transporter.sendMail({
      from: '"Genius Komputer" <muhammadirfan2823@gmail.com>', // sender address
      to: response.email, // list of receivers
      subject: "Verification Link", // Subject line
      html: `
      <div style="background-color: #f4f6f8; padding: 40px 0; font-family: Arial, Helvetica, sans-serif;">
          <div style="max-width: 480px; margin: auto; background: #ffffff; border-radius: 16px; padding: 30px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            
            <!-- Logo -->
            <img 
              src="https://res.cloudinary.com/dbgugbfil/image/upload/v1775291771/1_20240219_045525_0000_-_Copy_j3fqxu.png" 
              alt="Genius Komputer"
              style="width: 120px; margin-bottom: 20px;"
            />

            <!-- Title -->
            <h2 style="margin: 0; font-size: 22px; color: #222;">
              Verifikasi Email Anda
            </h2>

            <!-- Subtitle -->
            <p style="font-size: 14px; color: #555; margin: 16px 0;">
              Terima kasih telah mendaftar di <b>Genius Komputer</b>.<br/>
              Klik tombol di bawah untuk mengaktifkan akun Anda.
            </p>

            <!-- Button -->
            <a 
              href="${fullUrl}/api/v1/auth/verify-email?token=${token}"
              style="
                display: inline-block;
                background: #0066ff;
                color: #ffffff;
                padding: 12px 24px;
                border-radius: 10px;
                text-decoration: none;
                font-size: 14px;
                font-weight: bold;
                margin: 20px 0;
              "
            >
              Verifikasi Sekarang
            </a>

            <!-- Divider -->
            <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />

            <!-- Footer -->
            <p style="font-size: 12px; color: #888;">
              Abaikan email ini jika Anda tidak merasa membuat akun.
            </p>

            <p style="font-size: 12px; color: #aaa; margin-top: 10px;">
              © ${new Date().getFullYear()} Genius Komputer
            </p>

          </div>
        </div>
      `,
    });

    // 4. Create email verification token in database
    await createEmailVerificationService(
      token,
      userId,
      new Date(Date.now() + 3600000),
    );

    console.log("Message sent: %s", info.messageId);
    res.status(201).json({
      message: "Register success, please check your email",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function VerifyEmail(req: Request, res: Response) {
  try {
    const { token } = req.query;
    console.log("token di VerifyEmail controller", token);
    await verifyEmailService(token as string);
    res.status(200).json({ message: "Email verified" });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Verification failed",
    });
  }
}

export async function Login(req: Request, res: Response) {
  try {
    const response = await loginService(req.body);
    res.json(response);
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Login failed",
    });
  }
}

export async function getUser(req: Request, res: Response) {
  try {
    const user = res.locals.user;
    const response = await getUserService(user.id);
    res.json(response);
  } catch (error) {}
}
