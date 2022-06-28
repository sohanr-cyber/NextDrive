import nc from "next-connect";
import Folder from "../../../models/Folder";
import { isAuth } from "../../../utils/auth";
import db from "../../../utils/db";

const handler = nc();
handler.use(isAuth);

//create Folder
handler.post(async (req, res) => {
  try {
    await db.connect();

    const { parentFolder, name } = req.body;
    const folder = await new Folder({
      name,
      parentFolder,
      createdBy: req.user._id,
    });

    if (parentFolder) {
      const ExistedparentFolder = await Folder.findOne({ _id: parentFolder });
      folder.path = [...ExistedparentFolder.path, ExistedparentFolder._id];
      await ExistedparentFolder.save();
    }
    const newFolder = await folder.save();
    await db.disconnect();
    res.status(200).send(newFolder);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

export default handler;
