import bcrypt from 'bcrypt';
import { UsersCollection } from '../db/models/user.js';
import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/session.js';
import { randomBytes } from 'crypto';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/sendEmail.js';
import { env } from '../utils/env.js';

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (user) throw createHttpError(409, 'Email in use');

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({ ...payload, password: hashedPassword });
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (!user) throw createHttpError(401, 'Email or password is invalid');

  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) throw createHttpError(401, 'Email or password is invalid');

  await SessionsCollection.deleteOne({ userId: user._id });
  const newSession = createSession();

  return await SessionsCollection.create({
    userId: user._id,
    ...newSession,
  });
};

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) throw createHttpError(401, 'Session not found');

  const isSessionTokenExpired = new Date() > session.refreshTokenValidUntil;

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }
  await SessionsCollection.deleteOne({ _id: sessionId });

  const newSession = createSession();

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });

  if (!user) throw createHttpError(404, 'User not found');

  const resetToken = jwt.sign({ sub: user._id, email }, env.JWT_SECRET, {
    expiresIn: '5m',
  });

  const resetLink = `${env.APP_DOMAIN}/reset-password?token=${resetToken}`;

  try {
    await sendEmail({
      to: email,
      subject: 'Reset your password',
      template: 'reset-password-email.html',
      data: {
        name: user.name,
        link: resetLink,
      },
    });
  } catch (error) {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, env.JWT_SECRET);
  } catch (error) {
    if (error instanceof Error) {
      throw createHttpError(401, 'Token is expired or invalid');
    }
    throw error;
  }

  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) throw createHttpError(404, 'User not found!');

  if (user.passwordChangedAt) {
    const tokenIssuedAt = entries.iat;
    const passwordChangedTimeStamp = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10,
    );

    if (tokenIssuedAt < passwordChangedTimeStamp) {
      throw createHttpError(
        401,
        'Token is no longer valid. Please request a new one.',
      );
    }
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword, passwordChangedAt: new Date() },
  );

  await SessionsCollection.deleteMany({ userId: user._id });
};
