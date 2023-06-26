import { PrismaClient } from "@prisma/client";
import { prisma } from "../lib/prisma";

const userData = {
    username: "jawad",
    companyName: "jawad",
    password: "1234",
    isAdmin: true
}
  
  async function main() {
    console.log(`Start seeding ...`)
    const seedUser = await prisma.user.create({
        data: userData,
    })
    console.log(`Created user with id : ${seedUser.id}`)
    console.log(`Seeding finished.`)
  }
  
  main()
    .then(async () => {
      await prisma.$disconnect()
    })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })