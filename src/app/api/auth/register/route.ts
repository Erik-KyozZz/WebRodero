import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { sendVerificationCodeEmail } from "@/lib/mailer";
import { sanitizeInput } from "@/lib/security";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    const cleanName = sanitizeInput(name.trim());
    const cleanEmail = email.trim().toLowerCase();

    // Basic email format regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: "El formato de correo electrónico no es válido" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 8 caracteres" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return NextResponse.json(
        { error: "Este correo electrónico ya está registrado" },
        { status: 400 }
      );
    }

    // Generar código numérico seguro de 6 dígitos con crypto.randomInt
    const verificationCode = crypto.randomInt(100000, 1000000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    const hashedPassword = await bcrypt.hash(password, 12); // Cost 12
    const newUser = new User({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      role: "user",
      isEmailVerified: false,
      emailVerificationToken: verificationCode,
      emailVerificationTokenExpires: expiresAt,
    });

    await newUser.save();

    try {
      await sendVerificationCodeEmail(cleanEmail, cleanName, verificationCode);
    } catch (mailErr) {
      console.error("Error al enviar código de verificación:", mailErr);
    }

    return NextResponse.json(
      {
        message: "Código de verificación enviado a tu correo.",
        requireVerification: true,
        email: cleanEmail,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al registrar usuario", details: error.message },
      { status: 500 }
    );
  }
}
