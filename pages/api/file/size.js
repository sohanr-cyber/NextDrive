import nc from "next-connect";
import File from "../../../models/File";
import { isAuth } from "../../../utils/auth";
import db from "../../../utils/db";
import mongoose from "mongoose";

const handler = nc();

handler.use(isAuth);
handler.get(async (req, res) => {
  try {
    await db.connect();
    const sizes = await File.aggregate([
      {
        $match: {
          createdBy: mongoose.Types.ObjectId(req.user._id),
          trashed: false,
        },
      },
      {
        $group: {
          _id: "$type",
          total: {
            $sum: "$size",
          },
          totalFiles: {
            $sum: 1,
          },
        },
      },
    ]);

    await db.disconnect();

    res.status(200).send(sizes);
  } catch (error) {
    console.log({ error });
    res.status(500).send({ error: error });
  }
});

export default handler;
