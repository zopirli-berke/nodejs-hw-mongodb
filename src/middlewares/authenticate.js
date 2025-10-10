import createHttpError from 'http-errors';

import { SessionsCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    next(createHttpError(401, 'Please provide Authorization header'));
    return;
  }

  const bearer = authHeader.split(' ')[0];
  const accessToken = authHeader.split(' ')[1];

  if (bearer !== 'Bearer' || !accessToken) {
    next(createHttpError(401, 'Auth header should be of type Bearer'));
    return;
  }

  const session = await SessionsCollection.findOne({
    accessToken: accessToken,
  });

  if (!session) {
    next(createHttpError(401, 'Session not found'));
    return;
  }

  const isSessionTokenExpired = new Date() > session.accessTokenValidUntil;

  if (isSessionTokenExpired) {
    next(createHttpError(401, 'Access token expired'));
    return;
  }

  const user = await UsersCollection.findById(session.userId);

  if (!user) {
    next(createHttpError(401, 'User not found'));
    return;
  }

  req.user = user;
  next();
};
