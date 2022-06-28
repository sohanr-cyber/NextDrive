import Image from "next/image";
import React, { useState } from "react";
import styles from "../styles/Photos.module.css";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import Bottom from "./Bottom";
import axios from "axios";
import { storage } from "../firebase";

import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { useSnackbar } from "notistack";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { addToRecent, fetchFileSize } from "../redux/fileSlice";

const Files = ({ files, setFiles }) => {
  const [selected, setSelected] = useState(null);
  const userInfo = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();
  const router = useRouter();
  console.log(router.route);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleStarOrDelete = async (file, end) => {
    console.log("function runnding");
    try {
      const { data } = await axios.put(
        `/api/file/${end}`,
        {
          id: file._id,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      if (router.route == "/files/bookmarks") {
        setFiles(files.filter((file) => file._id != data._id));
      }

      if (end == "trash") {
        enqueueSnackbar(
          `File ${data.trashed ? "Deleted" : "Restored"} Succesfully`,
          {
            variant: "success",
          }
        );
        dispatch(fetchFileSize());
        setFiles(files.filter((file) => file._id != data._id));
      }

      if (
        end == "star" &&
        (router.route == "/files/photos" ||
          router.route == "/files/videos" ||
          router.route == "/files/audios" ||
          router.route == "/files/docs" ||
          router.route == "/files/trash")
      ) {
        const newFiles = files.map((file) =>
          file._id == data._id ? { ...file, stared: !file.stared } : file
        );

        setFiles(newFiles);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const deleteFromFirebase = (file) => {
    const desertRef = ref(storage, `files/${file.slug}`);

    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        console.log("file deleted successfully");
        // File deleted successfully
        deleteFile(file);

        console.log(" from db file deleted successfully");
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
        console.log("error occurred: " + error);
      });
  };

  const deleteFile = async (file) => {
    try {
      const { data } = await axios.delete(`/api/file/${file.slug}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      enqueueSnackbar("file deleted", { variant: "info" });
      setFiles(files.filter((item) => file._id != item._id));

      console.log(data);
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: "error",
      });
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.items}>
        {files.map((file, k) => (
          <div
            className={styles.item}
            key={k}
            onDoubleClick={() => {
              dispatch(addToRecent({ ...file, createdAt: new Date() }));
              console.log(handlePermenantDelete(file));
              // router.push(file.url);
            }}
          >
            {file.type.includes("image") ? (
              <>
                <div className={styles.pic}>
                  <Image
                    src={file.url}
                    width="250px"
                    height="250px"
                    alt="No Image"
                  />
                </div>
              </>
            ) : file.type.includes("video") ? (
              <>
                <div
                  className={styles.pic}
                  style={{ border: "1px solid lightGrey" }}
                >
                  <Image
                    src="/assets/youtube.png"
                    width="250px"
                    height="250px"
                    alt="No Image"
                  />
                </div>
              </>
            ) : file.type.includes("application") ? (
              <>
                <div
                  className={styles.pic}
                  style={{ border: "1px solid lightGrey" }}
                >
                  <Image
                    src="/assets/pdf.png"
                    width="250px"
                    height="250px"
                    alt="No Image"
                  />
                </div>
              </>
            ) : file.type.includes("audio") ? (
              <>
                <div
                  className={styles.pic}
                  style={{ border: "1px solid lightGrey" }}
                >
                  <Image
                    src="/assets/audio-file.png"
                    width="250px"
                    height="250px"
                    alt="No Image"
                  />
                </div>
              </>
            ) : (
              <>
                <div
                  className={styles.pic}
                  style={{ border: "1px solid lightGrey" }}
                >
                  <Image
                    src="/assets/logo.png"
                    width="250px"
                    height="250px"
                    alt="No Image"
                  />
                </div>
              </>
            )}
            <Bottom
              file={file}
              selected={selected}
              setSelected={setSelected}
              giveStar={handleStarOrDelete}
              deleteFromFirebase={deleteFromFirebase}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Files;
