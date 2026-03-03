import prisma from "../config/database";
import ApiError from "../utils/ApiError";
import { Prisma } from "@prisma/client";
import * as bcrypt from "../utils/bcrypt";
import { generateToken } from "../utils/jwt";

export const registerUser = async (data: Prisma.UserCreateInput) => {
  const { password, ...userData } = data;

  // Check if email or username is already taken
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: data.email },
        { ...(data.username ? { username: data.username } : {}) },
      ],
    },
  });

  if (existingUser) {
    const isEmail = existingUser.email === data.email;
    throw new ApiError(
      400,
      `${isEmail ? "Email" : "Username"} is already taken`,
    );
  }

  const hashedPassword = await bcrypt.hashPassword(password);

  const user = await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      username: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  return user;
};

export const loginUser = async (loginId: string, password: string) => {
  if (!loginId) {
    throw new ApiError(400, "Email or username is required");
  }

  // Find user by email OR username
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: loginId }, { username: loginId }],
    },
  });

  if (!user) {
    throw new ApiError(401, "Incorrect email/username or password");
  }

  // Compare hashed password
  const isMatch = await bcrypt.comparePassword(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Incorrect email/username or password");
  }

  if (user.status !== "ACTIVE") {
    throw new ApiError(403, "Account is not active");
  }

  // Update last login and get the updated user object
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  // Generate real JWT token
  const token = generateToken({ id: updatedUser.id, role: updatedUser.role });

  const { password: _, ...userWithoutPassword } = updatedUser;

  return { user: userWithoutPassword, token };
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      lastLoginAt: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};
