import * as fs from 'node:fs';
import path from 'node:path';
import bcrypt from 'bcrypt';
import { User } from '../models/user.model.js';
import createHttpError from 'http-errors';
import { Session } from '../models/session.model.js';
import crypto from 'node:crypto';
import { sendMail } from '../utils/SendMail.js';
import Handlebars from 'handlebars';
import jwt from 'jsonwebtoken';
import { getEnvVar } from '../utils/getEnvVar.js';

const RESET_PASSWORD_TEMPLATE = fs.readFileSync(
  path.resolve('src', 'templates', 'reset-password.hbs'),
  'UTF-8',
);
console.log(RESET_PASSWORD_TEMPLATE);

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

export async function requestResetPassword(email) {
  const user = await User.findOne({ email: email });

  if (user === null) {
    throw new createHttpError.NotFound('User not found');
  }

  const token = jwt.sign(
    {
      sub: user._id,
      name: user.name,
    },
    getEnvVar('JWT_SECRET'),
    { expiresIn: '15m' },
  );

  const template = Handlebars.compile(RESET_PASSWORD_TEMPLATE);

  await sendMail(
    user.email,
    'Reset password',
    template({ link: `http://localhost:3000/reset-password/?token=${token}` }),
  );
  console.log('Email sent to', user.email);
}

export async function resetPassword(password, token) {
  try {
    const decoded = jwt.verify(token, getEnvVar('JWT_SECRET'));
    console.log('decoded', decoded);

    const user = await User.findById(decoded.sub);
    if (user === null) {
      throw new createHttpError.NotFound('User not found');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
    console.log(decoded);
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new createHttpError.Unauthorized('Token is unauthorized');
    }

    if (error.name === 'TokenExpiredError') {
      throw new createHttpError.Unauthorized('Token is expired');
    }

    throw error;
  }
}
