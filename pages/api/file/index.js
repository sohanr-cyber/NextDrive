import nc from "next-connect";
import File from "../../../models/File";
import { isAuth } from "../../../utils/auth";
import db from "../../../utils/db";

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  try {
    await db.connect();
    const type = await File.find({});

    await db.disconnect();

    res.status(200).send(type);
  } catch (error) {
    console.log({ error });
    res.status(500).send({ error: error });
  }
});

handler.post(async (req, res) => {
  const { parentFolder, name, url, slug, type, size } = req.body;

  try {
    await db.connect();
    const newFile = new File({
      parentFolder,
      name,
      url,
      slug,
      type,
      size,
      createdBy: req.user._id,
    });
    const file = await newFile.save();
    res.status(200).send({ newFile });
  } catch (error) {
    console.log({ error });
    res.status(500).send({ error: error });
  }
});


export default handler;
