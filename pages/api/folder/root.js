import nc from "next-connect";
import Folder from "../../../models/Folder";
import db from "../../../utils/db";
import { isAuth } from "../../../utils/auth";

const handler = nc();
handler.use(isAuth);

//Find All the root folders
handler.get(async (req, res) => {
  try {
    await db.connect();

    const folder = await Folder.find({
      parentFolder: null,
      createdBy: req.user._id,
      trashed: false,
    }).populate({
      path: "path",
      select: { name: 1, _id: 1 },
    });

    await db.disconnect();

    res.status(200).send(folder);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//Upload file in a folder using
// handler.put(async (req, res) => {
//   try {
//     await db.connect();
//     const existedFolder = await Folder.findOne({ _id: null });
//     existedFolder.files.push(req.body);
//     await existedFolder.save();
//     await db.disconnect();
//     res.status(200).send(existedFolder);
//   } catch (error) {
//     console.log(error);
//     res.status(400).send(errro);
//   }
// });

export default handler;
