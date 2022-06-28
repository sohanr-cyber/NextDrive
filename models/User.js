import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hashpassword: { type: String, required: true },

    pic: {
      type: String,
      default:
        "https://imgs.search.brave.com/qBRPST33yXlKA1gKPTBX3iVJJtD4CL0_fMEgjiK8qpQ/rs:fit:1024:1024:1/g:ce/aHR0cHM6Ly93d3cu/c2FsaXNidXJ5dXQu/Y29tL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDIwLzA5L2F2YXRh/ci0xLTEwMjR4MTAy/NC5qcGVn",
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
