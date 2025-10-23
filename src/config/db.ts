import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const connectDb = async () => {
  await prisma.$connect();
};

export default prisma;