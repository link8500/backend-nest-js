import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("Admin123!", 10);

  const tenant = await prisma.tenant.upsert({
    where: { slug: "backend-nestjs" },
    update: { name: "Backend NestJS" },
    create: {
      name: "Backend NestJS",
      slug: "backend-nestjs",
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@backend-nestjs.local" },
    update: {
      name: "Administrador",
      password,
      tenantId: tenant.id,
    },
    create: {
      name: "Administrador",
      email: "admin@backend-nestjs.local",
      password,
      tenantId: tenant.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "user@backend-nestjs.local" },
    update: {
      name: "Usuario de prueba",
      password,
      tenantId: tenant.id,
    },
    create: {
      name: "Vendedor de prueba",
      email: "user@backend-nestjs.local",
      password,
      tenantId: tenant.id,
    },
  });

  console.log("Seed completado para el tenant backend-nestjs.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
