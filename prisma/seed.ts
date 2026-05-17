import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Bootstrap admin uniquement.
  // Les catégories et produits sont gérés 100% depuis l'interface /admin.
  const envPseudo = process.env.ADMIN_PSEUDO;
  const envPassword = process.env.ADMIN_PASSWORD;
  if (envPseudo && envPassword) {
    const passwordHash = await bcrypt.hash(envPassword, 12);
    await prisma.adminUser.upsert({
      where: { pseudo: envPseudo },
      update: { passwordHash },
      create: { pseudo: envPseudo, passwordHash },
    });
    console.log(`Admin "${envPseudo}" prêt en base.`);
  } else {
    console.warn(
      "ADMIN_PSEUDO/ADMIN_PASSWORD absents du .env — admin non créé."
    );
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
