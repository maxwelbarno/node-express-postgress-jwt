import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const encrypt = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

const decrypt = (password, encryptedPassword) => {
  return bcrypt.compareSync(password, encryptedPassword);
};

const generateJwtToken = (user) => {
  const expiresIn = 60 * 60;
  const secret = process.env.SECRET;
  const data = { id: user.id, email: user.email };
  return { expiresIn, token: jwt.sign(data, secret, { expiresIn }) };
};

export { encrypt, decrypt, generateJwtToken };