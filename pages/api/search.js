import nc from "next-connect";
import { isAuth } from "../../utils/auth";
import File from "../../models/File";
import Folder from "../../models/Folder";
import db from "../../utils/db";

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  console.log(req.query.query);
  console.log(req.query.type);
  console.log(req.query.query == new String(""));
  console.log(typeof req.query.type);
  const queryFilter =
    req.query.query == "all"
      ? {}
      : { name: { $regex: new String(req.query.query), $options: "i" } };
  const typeFilter =
    req.query.type == "all"
      ? {}
      : { type: { $regex: new String(req.query.type) } };

  try {
    await db.connect();
    let folders = [];

    if (req.query.type == "folder" || req.query.type == "all") {
      folders = await Folder.find({
        createdBy: req.user._id,
        ...queryFilter,
      }).select({ _id: 1, name: 1 });
    }

    const files = await File.find({
      createdBy: req.user._id,
      ...queryFilter,
      ...typeFilter,
    });

    await db.disconnect();
    res.status(200).send({ files, folders });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

export default handler;
