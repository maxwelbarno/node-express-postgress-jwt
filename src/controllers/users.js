import crypto from 'crypto';
import {
  create,
  find,
  read,
  updateTokens,
  searchToken,
  updatePassword
} from '../models/user';
import db from '../utils/db';
import {
  encrypt,
  decrypt,
  generateJwtToken,
  createCookie
} from '../middleware/auth';
import transporter from '../services/mailer';

const register = async (req, res) => {
  const { email, password } = req.body;
  await db.query(create(email, encrypt(password)));
  res.status(201).send({ message: 'User successfully created!' });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await db.query(find(email));
  const user = rows[0];
  if (decrypt(password, user.password)) {
    const generatedData = generateJwtToken(user);
    const { token } = generatedData;
    createCookie(res, generatedData);
    res.status(200).send({ message: 'login successful!', token });
  }
};

const displayUsers = async (req, res) => {
  const { rows } = await db.query(read());
  res.status(200).send({ users: rows });
};

const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).send({ message: 'logout successful!' });
};

const forgot = async (req, res) => {
  const { email } = req.params;
  const token = crypto.randomBytes(20).toString('hex');
  const { rows } = await db.query(find(email));
  const user = rows[0];
  const expiry = new Date(Date.now() + 14400000).toGMTString();
  await db.query(updateTokens(user.email, token, expiry));

  const options = {
    to: 'barxwells@gmail.com',
    from: 'barxwells@gmail.com',
    subject: 'Password Reset',
    text:
      `${
        'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
        + 'Please click on the following link, or paste this into your browser to complete the process:\n\n'
        + 'http://'
      }${req.headers.host}/auth/reset/${token}\n\n`
      + 'If you did not request this, please ignore this email and your password will remain unchanged.\n'
  };
  transporter.sendMail(options, (err) => {
    if (err) {
      console.log(err);
    }
  });
  res.status(200).send({ message: 'success' });
};

const resetToken = async (req, res) => {
  const { token } = req.params;
  const { rows } = await db.query(searchToken(token));
  const user = rows[0];
  if (user) {
    req.user = user;
    res.status(200).send({ message: 'token retrieved successfully', token });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { rows } = await db.query(searchToken(token));
  const now = new Date(Date.now() + 10800000).toGMTString();
  const user = rows[0];
  const exp = Date.parse(user.reset_password_token_expires) + 14400000;

  if (!user) {
    res.status(400).send({ message: 'Password reset token is invalid!' });
  } else if (Date.parse(now) > exp) {
    res.status(400).send({ message: 'Password reset token is expired!' });
  } else {
    user.password = req.body.password;
    user.password_reset_token = '';
    user.reset_password_token_expires = now;
    await db.query(
      updatePassword(
        user.email,
        encrypt(user.password),
        user.password_reset_token,
        user.reset_password_token_expires
      )
    );
    res.status(200).send({ message: 'password updated successfully' });
  }
};

export {
  register,
  login,
  displayUsers,
  logout,
  forgot,
  resetToken,
  resetPassword
};
