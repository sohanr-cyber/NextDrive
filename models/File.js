import mongoose from "mongoose";

const fileSchema = mongoose.Schema(
  {
    name: { type: String },
    slug: { type: String },
    url: { type: String },
    size: { type: Number },
    type: { type: String },
    createdBy: { type: mongoose.Schema.ObjectId, ref: "User" },
    parentFolder: { type: mongoose.Schema.ObjectId, ref: "Folder" },
    stared: { type: Boolean, default: false },
    trashed: { type: Boolean, default: false },
  },
  { timestamps: true }
);


const File = mongoose.models.File || mongoose.model("File", fileSchema);
export default File;
