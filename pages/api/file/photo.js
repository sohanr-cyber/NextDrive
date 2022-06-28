import nc from "next-connect";
import File from "../../../models/File";
import { isAuth } from "../../../utils/auth";
import db from "../../../utils/db";

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  try {
    await db.connect();
    const photos = await File.find({
      createdBy: req.user._id,
      type: { $regex: "image" },
      trashed: false,
    }).sort({
      createdAt: -1,
    });

    await db.disconnect();

    res.status(200).send(photos);
  } catch (error) {
    console.log({ error });
    res.status(500).send({ error: error });
  }
});

export default handler;
