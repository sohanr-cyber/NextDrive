import React, { useState, useEffect } from "react";
import styles from "../styles/Move.module.css";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import ImageIcon from "@mui/icons-material/Image";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useSelector } from "react-redux";
import { fileName } from "../utils/helper";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
const Move = ({
  isFolder,
  moving,
  setMoving,
  folderTobeMoved,
  setFetchAgain,
}) => {
  console.log({ moving });
  const [path, setPath] = useState([]);
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const userInfo = useSelector((state) => state.user.userInfo);

  const fetch = async () => {
    try {
      const resPaths = await axios.get(`/api/folder/${moving._id}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      console.log(resPaths.data);

      setPath(resPaths.data.path);

      if (moving._id != "root") {
        const resFolders = await axios.get(`/api/folders/${moving._id}`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        setFolders(resFolders.data);

        const resFiles = await axios.get(`/api/file/${moving._id}`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        setFiles(resFiles.data);
      } else {
        const resFolders = await axios.get(`/api/folder/${moving._id}`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        setFolders(resFolders.data);
        setFiles([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetch();
  }, [moving]);

  const handleMove = async (id, parentFolder) => {
    try {
      const { data } = await axios.put(
        "/api/move",
        {
          id,
          parentFolder: parentFolder == "root" ? null : parentFolder,
          isFolder: true,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      console.log(data);
      setMoving(null);
      setFetchAgain((prev) => !prev);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <div className={styles.left}>
          <KeyboardBackspaceIcon
            onClick={() =>
              path &&
              (path[path.length - 1]
                ? setMoving(path[path.length - 1])
                : setMoving({
                    _id: "root",
                    name: "Drive",
                  }))
            }
          />
          <span>{moving ? moving.name : <>Drive</>}</span>
        </div>
        <div className={styles.right}>
          <CloseIcon onClick={() => setMoving(null)} />
        </div>
      </div>
      <div className={styles.location}>
        <div className={styles.folders}>
          {folders.length > 0 &&
            folders.map((folder, k) => (
              <div
                key={k}
                onClick={() => setMoving(folder)}
                className={styles.item}
              >
                <FolderIcon />
                <span> {folder.name}</span>
              </div>
            ))}
        </div>

        <div className={styles.files}>
          {files.length > 0 && <hr></hr>}
          {files.length > 0 &&
            files.map((file, k) => (
              <div key={k} className={styles.item}>
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

                {fileName(file)}
              </div>
            ))}
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.addFolder}>
          {/* <CreateNewFolderIcon onClick={() => handleCreateFolder()} /> */}
        </div>
        {folderTobeMoved == moving._id ? (
          <></>
        ) : (
          <div
            className={styles.btn}
            onClick={() => handleMove(folderTobeMoved, moving._id)}
          >
            Move
          </div>
        )}
      </div>
    </div>
  );
};

export default Move;
