import React, { useState } from "react";
import styles from "../styles/Files.module.css";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PendingIcon from "@mui/icons-material/Pending";
import { useRouter } from "next/router";
import axios from "axios";
import { useSnackbar } from "notistack";
import { storage } from "../firebase";
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { useSelector, useDispatch } from "react-redux";
import byteSize from "byte-size";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import ImageIcon from "@mui/icons-material/Image";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import { fileName, path } from "../utils/helper";
import { addToRecent, clearRecent } from "../redux/fileSlice";
import moment from "moment";

const Files = ({ inFolder, files, setFetchFileAgain, title, recent }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [url, setUrl] = useState(null);
  const [progresspercent, setProgresspercent] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(true);
  const [slug, setSlug] = useState(null);
  const [selected, setSelected] = useState(null);
  const [errorOccured, setError] = useState(null);
  const [renaming, setRenaming] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  console.log(files);
  console.log({ errorOccured });

  const currentFolder = useSelector((state) => state.folder.currentFolder);
  const userInfo = useSelector((state) => state.user.userInfo);

  const handleFile = async (file, slugValue) => {
    if (!file) return;

    console.log("uploading...");
    setUploading(true);

    const storageRef = ref(storage, `files/${slugValue}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgresspercent(progress);
      },
      (error) => {
        setError(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUrl(downloadURL);
          setUploading(false);
        });
      }
    );
  };

  const saveFile = async (slug) => {
    if (!file || !url) {
      return;
    }

    console.log({ file });

    try {
      const { data } = await axios.post(
        "/api/file",
        {
          name: file.name,
          url,
          slug,
          type: file.type,
          size: file.size,
          parentFolder: router.query.id,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      enqueueSnackbar("New File Created", {
        variant: "success",
      });
      setUrl(null);
      setFile(null);
      console.log({ data });
      setFetchFileAgain((prev) => !prev);
    } catch (error) {
      enqueueSnackbar("Something went Wrong", {
        variant: "error",
      });
      console.log({ error });
    }
  };

  const handleRename = async () => {
    try {
      const { data } = await axios.put(
        `/api/file/${selected}`,
        {
          name,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      setFetchFileAgain((prev) => !prev);
      enqueueSnackbar("Fle Renamed", {
        variant: "success",
      });
      setRenaming(false);
    } catch (error) {
      console.log(error);
    }
  };

  const CancelSaving = (file) => {
    const desertRef = ref(storage, `files/${file.slug}`);

    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        console.log("file deleted successfully");
        // File deleted successfully
        setUrl(null);
        setSlug(null);
        setFile(null);

        console.log(" from db file deleted successfully");
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
        console.log("error occurred: " + error);
      });
  };

  const handleStarOrDelete = async (file, endPath) => {
    try {
      const { data } = await axios.put(
        `/api/file/${endPath}`,
        {
          id: file._id,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      if (endPath == "trash") {
        enqueueSnackbar(`Added To Trash`, {
          variant: "info",
        });
      }
      setFetchFileAgain((prev) => !prev);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
      console.log({ error });
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        {inFolder ? (
          <div className={styles.title}>File</div>
        ) : (
          <div className={styles.title}>{title}</div>
        )}

        {inFolder &&
          (url ? (
            <div className={styles.flex}>
              <div onClick={() => saveFile(slug)}>Save</div>
              <div onClick={() => CancelSaving({ ...file, slug })}>cancel</div>
            </div>
          ) : uploading ? (
            <></>
          ) : (
            <div className={styles.action}>
              <input
                type="file"
                onChange={(e) => {
                  let slugValue = e.target.files[0].name + Math.random();
                  setSlug(slugValue);
                  setFile(e.target.files[0]);
                  handleFile(e.target.files[0], slugValue);
                }}
              />
            </div>
          ))}

        {recent && (
          <div className={styles.flex} onClick={() => dispatch(clearRecent())}>
            Clear
          </div>
        )}
      </div>

      {renaming && (
        <>
          <div className={styles.formContainer}>
            <form>
              <input
                type="text"
                placeholder="Folder Name"
                onChange={(e) => setName(e.target.value)}
              />
              <div className={styles.submit}>
                <div className={styles.btn} onClick={() => handleRename()}>
                  Create
                </div>
                <div className={styles.btn} onClick={() => setRenaming(false)}>
                  Cancel
                </div>
              </div>
            </form>
          </div>
        </>
      )}

      {uploading && (
        <div className={styles.progressbar}>
          <div className={styles.box}>
            <div
              className={`${styles.progress} ${
                errorOccured && styles.prgressFailed
              }`}
              style={{
                width: `${errorOccured ? "100%" : progresspercent}%`,
              }}
            ></div>
          </div>
        </div>
      )}

      <div className={styles.files}>
        {files?.map((file, k) => (
          <div className={styles.fileWrapper} key={k}>
            <div
              className={styles.file}
              key={k}
              onDoubleClick={() => {
                dispatch(addToRecent({ ...file, createdAt: new Date() }));
                router.push(file.url);
              }}
            >
              <div className={styles.item}>
                {file.type?.includes("image") ? (
                  <ImageIcon className={styles.icon} />
                ) : file.type?.includes("application") ? (
                  <PictureAsPdfIcon className={styles.icon} />
                ) : file.type?.includes("video") ? (
                  <VideoFileIcon className={styles.icon} />
                ) : file.type?.includes("audio") ? (
                  <AudioFileIcon className={styles.icon} />
                ) : (
                  <InsertDriveFileIcon className={styles.icon} />
                )}

                <div className={styles.name}>{fileName(file, 12)}</div>
              </div>
              {selected == file._id ? (
                <>
                  <div className={styles.icon}>
                    <ModeEditIcon onClick={() => setRenaming(true)} />
                  </div>
                  <div
                    className={styles.icon}
                    onClick={() => handleStarOrDelete(file, "star")}
                  >
                    {file.stared ? <StarIcon /> : <StarBorderIcon />}
                  </div>

                  <div className={styles.icon}>
                    <a href={file.url}>
                      <DownloadIcon />
                    </a>
                  </div>
                  <div className={styles.icon}>
                    <DeleteIcon
                      onClick={() => handleStarOrDelete(file, "trash")}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.span}>
                    {inFolder
                      ? moment(file.createdAt).format("MMMM D, YYYY")
                      : moment(file.createdAt).fromNow()}
                  </div>

                  <div className={styles.span}>
                    {byteSize(file.size).value} {byteSize(file.size).unit}
                  </div>
                </>
              )}

              {inFolder ? (
                <div
                  className={`${styles.span} ${styles.innerItem}`}
                  onClick={() => {
                    selected == file._id
                      ? setSelected(null)
                      : setSelected(file._id);
                  }}
                >
                  {selected == file._id ? (
                    <>
                      <CancelIcon style={{ color: "red", cursor: "pointer" }} />
                    </>
                  ) : (
                    <>
                      <PendingIcon
                        style={{ color: "lightGrey", cursor: "pointer" }}
                      />
                    </>
                  )}
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Files;
