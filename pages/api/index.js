import nc from "next-connect";
import Folder from "../../models/Folder";
import db from "../../utils/db";

const handler = nc();

handler.put(async (req, res) => {
  try {
    await db.connect();
    const folders = await Folder.find({ parentFolder: null });
    folders.forEach((folder) => (folder.parentFolder = "root"));
    const savedFolder = await folders.save();
    res.status(200).send(savedFolder);
  } catch (error) {
    console.log(error);
  }
});

export default handler;
