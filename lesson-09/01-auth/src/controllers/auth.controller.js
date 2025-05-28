import { loginUser, registerUser } from '../services/auth.service.js';

export async function registerController(req, res) {
  const user = await registerUser(req.body);
  res
    .status(201)
    .json({ status: 201, message: 'User created successfully', data: user });
}

export async function loginController(req, res) {
  const session = await loginUser(req.body.email, req.body.password);
  console.log(session);

  res.status(200).json({
    status: 200,
    message: 'Login successfully',
    data: {
      accessToken: session.accessToken,
    },
  });
}
