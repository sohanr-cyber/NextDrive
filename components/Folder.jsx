import React, { useState } from "react";
import FolderIcon from "@mui/icons-material/Folder";
import styles from "../styles/Mid.module.css";
import { useRouter } from "next/router";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { fileName } from "../utils/helper";
import { useSnackbar } from "notistack";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import Move from "./Move";

const Folder = ({ home, folders, setFetchAgain, setFolders }) => {
  const [folderName, setFolderName] = useState("");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const userInfo = useSelector((state) => state.user.userInfo);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [renaming, setRenaming] = useState(false);
  const [folderToUpdate, setFolderToUpdate] = useState(null);
  const [moving, setMoving] = useState(null);
  const [folderTobeMoved, setfolderTobeMoved] = useState(null);

  const handleAction = () => {};

  const handleCreateFolder = async () => {
    if (folderName.length < 1) {
      enqueueSnackbar("Foder Name Can not be empty!", { variant: "warning" });

      return;
    }
    const parent = router.query.id ? router.query.id : null;
    try {
      const { data } = await axios.post(
        "/api/folder",
        {
          name: folderName,
          parentFolder: parent,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      console.log({ data });
      enqueueSnackbar("New Folder Created", { variant: "success" });

      setFolderName("");
      setFolders((prev) => [...prev, data]);

      // setFetchAgain((prev) => !prev);
      setOpen(false);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });

      console.log(error);
    }
  };

  const handleClick = (e, folder) => {
    console.log({ type: e.type });
    if (e.type === "click") {
      console.log("Left click");
      setSelectedFolder(null);
    } else if (e.type === "contextmenu") {
      e.preventDefault();
      console.log("Right click");
      setSelectedFolder(folder._id);
    }
  };

  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(`/api/folder/${selectedFolder}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      setFolders(folders.filter((item) => item._id != data._id));
      // setFetchAgain((prev) => !prev);
      enqueueSnackbar("Folder Deleted", {
        variant: "info",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleRenameFolder = async () => {
    try {
      const { data } = await axios.put(
        `/api/folder/${folderToUpdate}`,
        {
          name: folderName,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      setFolders(
        folders.map((item) =>
          item._id == folderToUpdate ? { ...item, name: folderName } : item
        )
      );
      // setFetchAgain((prev) => !prev);
      enqueueSnackbar("Folder Renamed", {
        variant: "success",
      });
      setRenaming(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.wrapper}>
      {open && !home && (
        <>
          <div className={styles.formContainer}>
            <form>
              <input
                type="text"
                placeholder="Folder Name"
                onChange={(e) => setFolderName(e.target.value)}
              />
              <div className={styles.submit}>
                <div
                  className={styles.btn}
                  onClick={() => handleCreateFolder()}
                >
                  Create
                </div>
                <div className={styles.btn} onClick={() => setOpen(false)}>
                  Cancel
                </div>
              </div>
            </form>
          </div>
        </>
      )}

      {renaming && (
        <>
          <div className={styles.formContainer}>
            <form>
              <input
                type="text"
                placeholder="Folder Name"
                onChange={(e) => setFolderName(e.target.value)}
              />
              <div className={styles.submit}>
                <div
                  className={styles.btn}
                  onClick={() => handleRenameFolder()}
                >
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

      {moving && (
        <div className={styles.formContainer}>
          {
            <Move
              moving={moving}
              setMoving={setMoving}
              isFolder={true}
              setFetchAgain={setFetchAgain}
              folderTobeMoved={folderTobeMoved}
            />
          }
        </div>
      )}

      <div className={styles.folders}>
        <div className={styles.top}>
          <div className={styles.title}>
            {home ? <>Recent Accessed Folder</> : <>Folder</>}
          </div>
          <div className={styles.action} onClick={() => handleAction()}>
            {home ? (
              <div>Clear</div>
            ) : (
              <div onClick={() => setOpen(true)}>Create</div>
            )}
          </div>
        </div>
        <div
          className={`${styles.items} ${home && styles.recent}`}
          onClick={() => setSelectedFolder(false)}
        >
          {folders?.map((folder, k) => (
            <div
              className={styles.item}
              onDoubleClick={() => router.push(`/folder/${folder._id}`)}
              key={k}
            >
              <div
                className={styles.innerItem}
                onClick={(e) => handleClick(e, folder)}
                onContextMenu={(e) => handleClick(e, folder)}
              >
                <FolderIcon className={styles.icon} />
                <div className={styles.name}>{fileName(folder, 25)} </div>
                {selectedFolder == folder._id && (
                  <div className={styles.selected}>
                    <ModeEditIcon
                      onClick={() => {
                        setRenaming(true);
                        setFolderToUpdate(folder._id);
                      }}
                    />
                    {/* <DeleteIcon onClick={() => handleDelete()} /> */}
                    <DriveFileMoveIcon
                      onClick={() => {
                        setMoving(folder.parentFolder);
                        setfolderTobeMoved(folder._id);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Folder;
