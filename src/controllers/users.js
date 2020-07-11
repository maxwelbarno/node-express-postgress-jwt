import create from "../models/user";
import db from "../utils/db";

const register = async (req, res) => {
  const { email, password } = req.body;await db.query(create(email, password));
  res.status(201).send({message:"User successfully created!"});
};

export default register