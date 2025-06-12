import {
  loginOrRegister,
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
  requestResetPassword,
  resetPassword,
} from '../services/auth.service.js';
import { getOAuthUrl, validateCode } from '../utils/googleOauth.js';

export async function registerController(req, res) {
  const user = await registerUser(req.body);
  res
    .status(201)
    .json({ status: 201, message: 'User created successfully', data: user });
}

export async function loginController(req, res) {
  const session = await loginUser(req.body.email, req.body.password);
  console.log(session);

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: session.refreshTokenValidUntill,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expire: session.refreshTokenValidUntill,
  });

  res.status(200).json({
    status: 200,
    message: 'Login successfully',
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function logoutController(req, res) {
  const { sessionId, refreshToken } = req.cookies;

  if (typeof sessionId === 'string') {
    await logoutUser(sessionId, refreshToken);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.status(204).end();
}

export async function refreshController(req, res) {
  const { sessionId, refreshToken } = req.cookies;

  const session = await refreshSession(sessionId, refreshToken);
  console.log('session', session);

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: session.refreshTokenValidUntill,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expire: session.refreshTokenValidUntill,
  });

  res.status(200).json({
    status: 200,
    message: 'Resresh complete successfully',
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function requestResetPasswordController(req, res) {
  const { email } = req.body;

  await requestResetPassword(email);

  res.json({ status: 200, message: 'Reset password email sent successfully' });
}

export async function resetPassswordController(req, res) {
  const { password, token } = req.body;

  await resetPassword(password, token);

  res.send({ status: 200, message: 'Password reset successfully' });
}

export async function getOAuthController(req, res) {
  const url = getOAuthUrl();

  res.json({
    status: 200,
    message: 'Successfully get OAuth url',
    data: {
      oauth_url: url,
    },
  });
}

export async function confirmOAuthController(req, res) {
  const ticket = await validateCode(req.body.code);
  const session = await loginOrRegister(
    ticket.payload.email,
    ticket.payload.name,
  );
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: session.refreshTokenValidUntill,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expire: session.refreshTokenValidUntill,
  });

  res.json({
    status: 200,
    message: 'Login with Google successfully',
    data: {
      accessToken: session.accessToken,
    },
  });
}
