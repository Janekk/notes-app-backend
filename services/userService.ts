import {PrismaClient, User} from "@prisma/client"
import {PublicUser, ValidationError} from "../utils"

const prisma = new PrismaClient()

export async function getUser(email: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  })
}

export async function getPublicUser(email: string): Promise<PublicUser | null> {
  return await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  })
}

export async function registerUser(name: string, email: string, password: string) {
  const user = await getUser(email)
  if (user) {
    throw new ValidationError("User with this email already exists")
  }
  return await prisma.user.create({data: {name, email, password}})
}
