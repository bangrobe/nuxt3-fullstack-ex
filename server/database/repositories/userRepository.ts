import { IUser } from "~~/types/IUser";
import prisma from "../client";

export async function getUserByEmail(email: string) {
  const result = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return result;
}

export async function getUserByUsername(username: string): Promise<IUser> {
  return await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
}

export async function createUser(data: IUser) {
    const user = await prisma.user.create({
        data: {
            username: data.username,
            name: data.name,
            email: data.email,
            loginType: data.loginType,
            password: data.password
        }
    })

    return user;
}