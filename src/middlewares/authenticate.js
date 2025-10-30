import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
      throw createHttpError(401, 'Please provide Authorization header');
    }

    const bearer = authHeader.split(' ')[0];
    const accessToken = authHeader.split(' ')[1];

    if (bearer !== 'Bearer' || !accessToken) {
      throw createHttpError(401, 'Auth header should be of type Bearer');
    }

    const session = await SessionsCollection.findOne({
      accessToken: accessToken,
    });

    if (!session) {
      throw createHttpError(401, 'Session not found');
    }

    const isSessionTokenExpired = new Date() > session.accessTokenValidUntil;

    if (isSessionTokenExpired) {
      throw createHttpError(401, 'Access token expired');
    }

    const user = await UsersCollection.findById(session.userId);

    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
