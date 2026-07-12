import logger from '#config';
import { authenticateUser, createUser } from '#services';
import { cookies, formatValidationErrors, jwtToken } from '#utils';
import { signinSchema, signupSchema } from '#validations';

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
        id: user.id,
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

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const signin = async (req, res, next) => {
  try {
    const validationResult = signinSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        success: false,
        details: formatValidationErrors(validationResult.error),
      });
    }

    const { email, password } = validationResult.data;

    const user = await authenticateUser({ email, password });

    const token = jwtToken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    cookies.set(res, 'token', token);

    logger.info(`User signed in successfully: ${email}`);
    res.status(200).json({
      message: 'User signed in successfully',
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Signin error: ', error);
    if (error.message === 'Invalid email or password') {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    next(error);
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const signout = async (req, res, next) => {
  try {
    cookies.clear(res, 'token');

    logger.info('User signed out successfully');
    res.status(200).json({
      message: 'User signed out successfully',
      success: true,
    });
  } catch (error) {
    logger.error('Signout error: ', error);
    next(error);
  }
};
