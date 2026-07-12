import logger from '#config';
import { createUser } from '#services';
import { cookies, formatValidationErrors, jwtToken } from '#utils';
import { signupSchema } from '#validations';

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const signup = async (req, res, next) => {
  try {
    const validationResult = signupSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        success: false,
        details: formatValidationErrors(validationResult.error),
      });
    }

    const { email, name, role, password } = validationResult.data;

    // auth service
    const user = await createUser({ name, email, password, role });

    const token = jwtToken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    cookies.set(res, 'token', token);

    logger.info(`User signed up successfully: ${email}`);
    res.status(201).json({
      message: 'User signed up successfully',
      success: true,
      user: {
        id: user.id, // Replace with actual user ID from the database
        name,
        email,
        role,
      },
    });
  } catch (error) {
    logger.error('Signup error: ', error);
    if (error.message === 'User with this email already exists') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    next(error);
  }
};
