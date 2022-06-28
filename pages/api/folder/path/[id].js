import nc from "next-connect";
import { isAuth } from "../../../../utils/auth";
import db from "../../../../utils/db";
import Folder from "../../../../models/Folder";

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  try {
    await db.connect();
    const folder = await Folder.findOne({ _id: req.query.id }, { path: 1 });
    res.status(200).send(folder);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

export default handler;
