import { create, find } from '../models/user';
import db from '../utils/db';
import {encrypt, decrypt, generateJwtToken} from "../middleware/auth"

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
      const token=generateJwtToken(user)
    res.status(200).send({ message: 'login successful!', token });
  }
};

export { register, login };
