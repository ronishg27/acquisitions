import logger, { db } from '#config';
import { users } from '#models';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

export const hashPassword = async password => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    logger.error('Error hashing the password: ', error);
    throw new Error('Error hashing the password', { cause: error });
  }
};

export const createUser = async ({ email, name, role, password }) => {
  try {
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error('User already exists');
    }
    const hashedPassword = await hashPassword(password);
    const newUser = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      });

    logger.info(`User created successfully: ${newUser.email}`);
    return newUser;
  } catch (error) {
    console.log('Error creating user:', error);
    logger.error('Error creating user:', error);
    throw error;
  }
};
