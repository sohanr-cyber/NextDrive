import nc from "next-connect";
import { isAuth } from "../../utils/auth";
import File from "../../models/File";
import Folder from "../../models/Folder";
import db from "../../utils/db";

const handler = nc();
handler.use(isAuth);

handler.put(async (req, res) => {
  const { id, parentFolder, isFolder } = req.body;
  try {
    await db.connect();
    let updated;
    if (isFolder) {
      updated = await Folder.findOneAndUpdate({ _id: id }, { parentFolder });
    } else {
      updated = await File.findOneAndUpdate({ _id: id }, { parentFolder });
    }

    await db.disconnect();
    res.status(200).send(updated);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

export default handler;
