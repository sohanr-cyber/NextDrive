import mongoose from "mongoose";

const folderSchema = mongoose.Schema(
  {
    parentFolder: { type: mongoose.Schema.ObjectId, ref: "Folder" },
    path: [{ type: mongoose.Schema.ObjectId, ref: "Folder" }],
    name: { type: String },
    createdBy: { type: mongoose.Schema.ObjectId, ref: "User" },
    trashed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Folder = mongoose.models.Folder || mongoose.model("Folder", folderSchema);
export default Folder;
