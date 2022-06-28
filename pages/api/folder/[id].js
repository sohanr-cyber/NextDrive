import nc from "next-connect";
import File from "../../../models/File";
import Folder from "../../../models/Folder";
import { isAuth } from "../../../utils/auth";
import db from "../../../utils/db";

const handler = nc();
handler.use(isAuth);

// get Current Folder By Id
handler.get(async (req, res) => {
  try {
    await db.connect();

    const currentFolder = await Folder.findOne({
      createdBy: req.user._id,
      _id: req.query.id,
    })
      .populate({
        path: "path",
        select: { name: 1, _id: 1 },
      })
      .select("name");

    await db.disconnect();
    if (!currentFolder) res.status(404).send({ message: "Couldn't Found" });

    res.status(200).send(currentFolder);
  } catch (error) {
    console.log(error);
  }
});

handler.put(async (req, res) => {
  try {
    await db.connect();
    const folder = await Folder.findOneAndUpdate(
      { _id: req.query.id },
      {
        name: req.body.name,
      }
    );
    await db.disconnect();
    res.status(200).send(folder);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

handler.delete(async (req, res) => {
  try {
    await db.connect();
    // const files = await File.updateMany(
    //   { parentFolder: req.query.id },
    //   { trashed: true }
    // );
    const folder = await Folder.findOneAndUpdate(
      {
        _id: req.query.id,
      },
      { trashed: true }
    );
    res.status(200).send(folder);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

export default handler;
