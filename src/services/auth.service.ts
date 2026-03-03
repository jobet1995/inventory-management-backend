import prisma from '../config/database';
import ApiError from '../utils/ApiError';
import { Prisma } from '@prisma/client';
import * as bcrypt from '../utils/bcrypt';
import { generateToken } from '../utils/jwt';

export const registerUser = async (data: Prisma.UserCreateInput) => {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingUser) {
    throw new ApiError(400, 'Email already taken');
  }

  const hashedPassword = await bcrypt.hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    }
  });

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    throw new ApiError(401, 'Incorrect email or password');
  }

  // Compare hashed password
  const isMatch = await bcrypt.comparePassword(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Incorrect email or password');
  }

  if (user.status !== 'ACTIVE') {
    throw new ApiError(403, 'Account is not active');
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() }
  });

  // Generate real JWT token
  const token = generateToken({ id: user.id, role: user.role });

  const { password: _, ...userWithoutPassword } = user;

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
    }
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user;
};
