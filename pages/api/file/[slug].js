import nc from "next-connect";
import File from "../../../models/File";
import { isAuth } from "../../../utils/auth";
import db from "../../../utils/db";

const handler = nc();
handler.use(isAuth);

handler.delete(async (req, res) => {
  try {
    await db.connect();
    const deletedDocument = await File.findOneAndDelete({
      slug: req.query.slug,
    });
    console.log(deletedDocument);

    await db.disconnect();

    if (deletedDocument) {
      res.status(200).send({ message: "successfully Deleted" });
    } else {
      res.status(404).send({ message: "Not Found" });
    }
  } catch (error) {
    console.log({ error });
    res.status(500).send({ error: error });
  }
});

handler.get(async (req, res) => {
  try {
    await db.connect();
    const files = await File.find({
      parentFolder: req.query.slug,
      trashed: false,
    }).sort({
      createdAt: -1,
    });

    res.status(200).send(files);
  } catch (error) {}
});

handler.put(async (req, res) => {
  try {
    await db.connect();
    const file = await File.findOneAndUpdate(
      { _id: req.query.slug },
      {
        name: req.body.name,
      }
    );
    res.status(200).send(file);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
export default handler;
