import crypto from 'crypto';
import {
  create, find, read, updateTokens
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
      `${'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
      + 'Please click on the following link, or paste this into your browser to complete the process:\n\n'
      + 'http://'}${
        req.headers.host
      }/reset/${
        token
      }\n\n`
      + 'If you did not request this, please ignore this email and your password will remain unchanged.\n'
  };
  transporter.sendMail(options, (err) => {
    if (err) {
      console.log(err);
    }
  });
  res.status(200).send({ message: 'success' });
};

export {
  register, login, displayUsers, logout, forgot
};
