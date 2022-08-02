import nc from "next-connect";
import Folder from "../../../models/Folder";
import { isAuth } from "../../../utils/auth";
import db from "../../../utils/db";

const handler = nc();
handler.use(isAuth);

// get All the folder by parent folder
handler.get(async (req, res) => {
  try {
    await db.connect();
    const folders = await Folder.find({
      createdBy: req.user._id,
      parentFolder: req.query.id,
      trashed: false,
    })
      .populate({
        path: "parentFolder",
        select: { name: 1, _id: 1 },
      })
      .select("_id , name , parentFolder");
    console.log({ folders });

    await db.disconnect();

    res.status(200).send(folders);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

export default handler;
