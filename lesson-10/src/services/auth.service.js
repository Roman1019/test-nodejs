import bcrypt from 'bcrypt';
import { User } from '../models/user.model.js';
import createHttpError from 'http-errors';
import { Session } from '../models/session.model.js';
import crypto from 'node:crypto';

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

  await Session.deleteOne({ userId: user._id });

  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  return Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 10 * 60 * 1000),
    refreshTokenValidUntill: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
}

export async function logoutUser(sessionId, refreshToken) {
  await Session.deleteOne({ _id: sessionId, refreshToken });
}

export async function refreshSession(sessionId, refreshToken) {
  const session = await Session.findOne({ _id: sessionId });
  console.log({ _id: sessionId });

  if (session === null) {
    throw new createHttpError.Unauthorized('Sesssion not found');
  }

  if (session.refreshToken !== refreshToken) {
    throw new createHttpError.Unauthorized('Refresh token is invalid');
  }

  if (session.refreshTokenValidUntill < new Date()) {
    throw new createHttpError.Unauthorized('Refresh token is expired');
  }

  await Session.deleteOne({ _id: session._id });

  return Session.create({
    userId: session.userId,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 10 * 60 * 1000),
    refreshTokenValidUntill: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
}
