import bcrypt from 'bcrypt';
import { User } from '../models/user.model.js';
import createHttpError from 'http-errors';
import { Session } from '../models/session.model.js';

export async function registerUser(payload) {
  const user = await User.findOne({ email: payload.email });
  if (user !== null) {
    throw new createHttpError.Conflict('Email is already in use');
  }

  payload.password = await bcrypt.hash(payload.password, 10);

  return User.create(payload);
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email });
  console.log('USER', user);

  if (user === null) {
    throw new createHttpError.Unauthorized('Email or password is incorect');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch !== true) {
    throw new createHttpError.Unauthorized('Email or password is incorect');
  }
  return Session.create({
    userId: user._id,
    accessToken: 'ACCESS_TOKEN',
    refreshToken: 'REFRESH_TOKEN',
    accessTokenValidUntil: new Date(Date.now() + 10 * 60 * 1000),
    refreshTokenValidUntill: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
}
