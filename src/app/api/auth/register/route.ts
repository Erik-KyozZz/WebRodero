import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { sendVerificationCodeEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "Este correo electrónico ya está registrado" },
        { status: 400 }
      );
    }

    // Generar código numérico único de 6 dígitos
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "user",
      isEmailVerified: false,
      emailVerificationToken: verificationCode,
      emailVerificationTokenExpires: expiresAt,
    });

    await newUser.save();

    // Enviar correo con el código mediante Resend
    try {
      await sendVerificationCodeEmail(email.toLowerCase(), name, verificationCode);
    } catch (mailErr) {
      console.error("Error al enviar código de verificación:", mailErr);
    }

    return NextResponse.json(
      {
        message: "Código de verificación enviado a tu correo.",
        requireVerification: true,
        email: email.toLowerCase(),
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
