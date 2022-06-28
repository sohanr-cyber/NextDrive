import nc from "next-connect";
import File from "../../../models/File";
import { isAuth } from "../../../utils/auth";
import db from "../../../utils/db";

const handler = nc();
handler.use(isAuth);

handler.put(async (req, res) => {
  try {
    await db.connect();
    const existed = await File.findOne({
      createdBy: req.user._id,
      _id: req.body.id,
    });
    console.log(existed);
    existed.trashed = existed.trashed ? false : true;

    await existed.save();

    await db.disconnect();
    res.status(200).send(existed);
  } catch (error) {
    console.log({ error });
    res.status(500).send({ error: error });
  }
});

handler.get(async (req, res) => {
  try {
    await db.connect();
    const staredFiles = await File.find({
      createdBy: req.user._id,
      trashed: true,
    });

    console.log(staredFiles);

    await db.disconnect();
    res.status(200).send(staredFiles);
  } catch (error) {
    console.log({ error });
    res.status(500).send({ error: error });
  }
});

export default handler;
