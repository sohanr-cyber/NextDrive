import nc from "next-connect";
import User from "../../../models/User";
import db from "../../../utils/db";
import bcrypt from "bcrypt";
import { signToken } from "../../../utils/auth";

const handler = nc();

// Create User
handler.post(async (req, res) => {
  try {
    await db.connect();
    const { password, email } = req.body;
    const existingUser = await User.findOne({ email: email });

    if (!existingUser) {
      return res.status(404).send({ message: "Not found" });
    }

    const match = bcrypt.compare(password, existingUser.hashpassword, 10);

    if (!match) {
      return res.status(404).send({ message: "Wrong Password" });
    }

    const token = signToken(existingUser);
    const { hashpassword, ...other } = existingUser;
    return res.status(200).send({ user: other._doc, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

export default handler;
