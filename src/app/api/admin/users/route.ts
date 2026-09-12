import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export async function GET() {
  try {
    await connectDB();
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al obtener usuarios", details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { userId, role } = await req.json();

    if (!userId || !role) {
      return NextResponse.json(
        { error: "ID de usuario y rol son obligatorios" },
        { status: 400 }
      );
    }

    if (!["admin", "moderator", "user"].includes(role)) {
      return NextResponse.json({ error: "Rol no válido" }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Rol actualizado con éxito", user: updatedUser });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al actualizar rol de usuario", details: error.message },
      { status: 500 }
    );
  }
}
