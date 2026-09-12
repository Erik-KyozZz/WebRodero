import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Correo y código de verificación son requeridos" },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    if (user.isEmailVerified) {
      return NextResponse.json({ message: "La cuenta ya se encuentra verificada" });
    }

    if (
      user.emailVerificationToken !== code.trim() ||
      !user.emailVerificationTokenExpires ||
      user.emailVerificationTokenExpires < new Date()
    ) {
      return NextResponse.json(
        { error: "El código de verificación es incorrecto o ha expirado" },
        { status: 400 }
      );
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;
    await user.save();

    return NextResponse.json({ message: "Cuenta verificada con éxito" });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al verificar código", details: error.message },
      { status: 500 }
    );
  }
}
