import createHttpError from 'http-errors';
import { Session } from '../models/session.model.js';
import { User } from '../models/user.model.js';

export async function auth(req, res, next) {
  const { authorization } = req.headers;
  console.log('req.headers', req.headers);

  if (typeof authorization !== 'string') {
    next(new createHttpError.Unauthorized('Please provide access token'));
  }

  const [bearer, accessToken] = authorization.split(' ', 2);
  if (bearer !== 'Bearer' || typeof accessToken !== 'string') {
    next(new createHttpError.Unauthorized('Please provide access token'));
  }

  const session = await Session.findOne({ accessToken });
  if (session === null) {
    next(new createHttpError.Unauthorized('Session not found'));
  }

  //   console.log([bearer, accessToken]);

  if (session.accessTokenValidUntil < new Date()) {
    next(new createHttpError.Unauthorized('Access token is expired'));
  }

  const user = await User.findOne({ _id: session.userId });
  if (user === null) {
    next(new createHttpError.Unauthorized('User not found'));
  }
  // console.log('req.user1', req.user);

  req.user = { _id: user._id, name: user.name };

  // console.log('req.user2', req.user);
  next();
}
