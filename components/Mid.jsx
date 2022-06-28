import React, { useState } from "react";
import Folder from "./Folder";
import FolderIcon from "@mui/icons-material/Folder";
import styles from "../styles/Mid.module.css";
import Files from "./Files";
import NavRoutes from "./NavRouter";


const Mid = ({ inFolder }) => {
  const [nums, setNums] = useState([1, 2, 2]);

  return (
    <div className={styles.container}>
      {inFolder && <NavRoutes />}
      {inFolder ? (
        <>
          <Folder />
          <Files inFolder={inFolder} />
        </>
      ) : (
        <>
          {" "}
          <Folder />
          <Folder recent={true} />
          <Files />
        </>
      )}
    </div>
  );
};

export default Mid;
