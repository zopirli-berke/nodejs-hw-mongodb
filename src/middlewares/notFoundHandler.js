import createHttpError from 'http-errors';

export const notFoundHandler = (res, req, next) => {
  const error = createHttpError(404, 'Route not found');

  next(error);
};
