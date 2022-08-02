import React from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import styles from "../styles/Mid.module.css";
import Link from "next/link";
import { useRouter } from "next/router";

const NavRouter = ({ path, current }) => {
  const router = useRouter();
  return (
    <div
      className={styles.wrapper}
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <div className={styles.nav} onClick={() => router.push("/")}>
        <span className={styles.route}> Drive</span>
        <NavigateNextIcon className={styles.navIcon} />
      </div>

      {path?.map((item, k) => (
        <div
          className={styles.nav}
          // style={{
          //   color: `${router.query.id == item._id ? "black" : ""}`,
          // }}
          key={k}
          onClick={() => router.push(`/folder/${item._id}`)}
        >
          <>
            <span className={styles.route}> {item.name}</span>
            <NavigateNextIcon className={styles.navIcon} />
          </>
        </div>
      ))}
    </div>
  );
};

export default NavRouter;
