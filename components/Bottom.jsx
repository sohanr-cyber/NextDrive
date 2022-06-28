import React from "react";
import styles from "../styles/Photos.module.css";
import PendingIcon from "@mui/icons-material/Pending";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import StarIcon from "@mui/icons-material/Star";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { fileName } from "../utils/helper";

const Bottom = ({
  selected,
  setSelected,
  file,
  giveStar,
  deleteFromFirebase,
}) => {


  
  return (
    <div className={styles.bottom}>
      {file?._id == selected ? (
        <>
          <div className={styles.icons}>
            <div className={styles.innerIcons}>
              {file.trashed ? (
                <>
                  <DeleteForeverIcon onClick={() => deleteFromFirebase(file)} />
                  <RestoreFromTrashIcon
                    onClick={() => giveStar(file, "trash")}
                  />
                </>
              ) : (
                <>
                  <DeleteIcon onClick={() => giveStar(file, "trash")} />
                  <FileDownloadIcon />
                </>
              )}

              {file.stared ? (
                <>
                  <StarIcon onClick={() => giveStar(file, "star")} />
                </>
              ) : (
                <StarBorderIcon onClick={() => giveStar(file, "star")} />
              )}
              <CancelIcon
                onClick={() => setSelected(null)}
                style={{ color: "red" }}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={styles.name}>{fileName(file, 9)}</div>
          <PendingIcon
            onClick={() => setSelected(file._id)}
            style={{ color: "lightgrey" }}
          />
        </>
      )}
    </div>
  );
};

export default Bottom;
