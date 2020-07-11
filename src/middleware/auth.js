import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const encrypt = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const decrypt = (password, encryptedPassword) => bcrypt.compareSync(password, encryptedPassword);

const generateJwtToken = (user) => {
  const expiresIn = 60 * 60;
  const secret = process.env.SECRET;
  const data = { id: user.id, email: user.email };
  return { expiresIn, token: jwt.sign(data, secret, { expiresIn }) };
};

const createCookie = (res, data) => {
  const cookieData = {
    expiresOn: new Date(Date.now() + data.expiresIn),
    secure: false,
    httpOnly: true
  };
  return res.cookie('token', data.token, cookieData);
};

export {
  encrypt, decrypt, generateJwtToken, createCookie
};
