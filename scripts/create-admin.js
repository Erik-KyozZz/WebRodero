require("dotenv").config({ path: ".env.local" });
const dns = require("dns");
// Forzar a Node.js a utilizar servidores DNS públicos (Google) para resolver los registros SRV de MongoDB Atlas si los de la operadora fallan
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ Error: MONGODB_URI no está configurada en .env.local");
  process.exit(1);
}

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function createAdmin() {
  try {
    console.log("Conectando a MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ Conectado a MongoDB Atlas exitosamente!");

    const adminEmail = process.env.ADMIN_EMAIL || "admin@ecommerce.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123456";

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log(`⚠️ El usuario administrador ${adminEmail} ya existe.`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const admin = new User({
      name: "Administrador Principal",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    console.log(`✅ Usuario administrador creado con éxito!`);
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
  } catch (error) {
    console.error("❌ Error al conectar o crear el usuario administrador:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdmin();
