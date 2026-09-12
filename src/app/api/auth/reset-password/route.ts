import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { sendPasswordResetEmail } from "@/lib/mailer";

// POST: Solicitar código de recuperación por correo
export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Ingresa tu correo electrónico" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Por seguridad responder éxito aunque el email no exista
      return NextResponse.json({ message: "Si la cuenta existe, se ha enviado un código de recuperación." });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    user.resetPasswordToken = resetCode;
    user.resetPasswordTokenExpires = expiresAt;
    await user.save();

    try {
      await sendPasswordResetEmail(user.email, user.name, resetCode);
    } catch (mailErr) {
      console.error("Error al enviar email de recuperación:", mailErr);
    }

    return NextResponse.json({ message: "Código de recuperación enviado a tu correo." });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al procesar la solicitud", details: error.message },
      { status: 500 }
    );
  }
}

// PUT: Cambiar contraseña ingresando el código recibido
export async function PUT(req: Request) {
  try {
    const { email, code, newPassword } = await req.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "La nueva contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    if (
      user.resetPasswordToken !== code.trim() ||
      !user.resetPasswordTokenExpires ||
      user.resetPasswordTokenExpires < new Date()
    ) {
      return NextResponse.json(
        { error: "El código de recuperación es incorrecto o ha expirado" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;
    await user.save();

    return NextResponse.json({ message: "Contraseña actualizada con éxito" });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al restablecer la contraseña", details: error.message },
      { status: 500 }
    );
  }
}
