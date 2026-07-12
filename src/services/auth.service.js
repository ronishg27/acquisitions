import { db, logger } from '#config';
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

export const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    logger.error('Error comparing the password: ', error);
    throw new Error('Error comparing the password', { cause: error });
  }
};

export const authenticateUser = async ({ email, password }) => {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    logger.info(`User authenticated successfully: ${email}`);
    return user;
  } catch (error) {
    logger.error('Error authenticating user: ', error);
    throw error;
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
    const [user] = await db
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

    logger.info(`User created successfully: ${user.email}`);
    return user;
  } catch (error) {
    console.log('Error creating user:', error);
    logger.error('Error creating user:', error);
    throw error;
  }
};
