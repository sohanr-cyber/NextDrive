import React, { useState, useEffect } from "react";
import styles from "../styles/Left.module.css";
import StorageIcon from "@mui/icons-material/Storage";
import StarBorderPurple500Icon from "@mui/icons-material/StarBorderPurple500";
import DeleteIcon from "@mui/icons-material/Delete";
import PhotoIcon from "@mui/icons-material/Photo";
import VideocamIcon from "@mui/icons-material/Videocam";
import ArticleIcon from "@mui/icons-material/Article";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";

import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { memory } from "../utils/helper";
import byteSize from "byte-size";

const Left = () => {
  const [sizes, setSizes] = useState([]);
  const router = useRouter();
  const userInfo = useSelector((state) => state.user.userInfo);
  const files = useSelector((state) => state.file.currentFiles);
  const fetchFileSizeAgain = useSelector(
    (state) => state.file.fetchFileSizeAgain
  );

  console.log(router);
  const fetch = async () => {
    try {
      const { data } = await axios.get("/api/file/size", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      setSizes(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetch();
  }, [files, fetchFileSizeAgain]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.first}>
        <Link href="/">
          <div
            className={`${styles.item} ${
              (router.route == "/folder/[id]" || router.route == "/") &&
              styles.selected
            }`}
          >
            <StorageIcon className={styles.icon} />
            <span>My Storage</span>
          </div>
        </Link>

        <Link href="/files/bookmarks">
          <div
            className={`${styles.item} ${
              router.route == "/files/bookmarks" && styles.selected
            }`}
          >
            <StarBorderPurple500Icon className={styles.icon} />
            <span>Bookmarks</span>
          </div>
        </Link>
        <Link href="/files/trash">
          <div
            className={`${styles.item} ${
              router.route == "/files/trash" && styles.selected
            }`}
          >
            <DeleteIcon className={styles.icon} />
            <span>Trash</span>
          </div>
        </Link>
      </div>

      <div className={styles.second}>
        <div className={styles.title}>Your Files</div>
        <div className={styles.files}>
          <Link href="/files/photos">
            <div
              className={`${styles.item} ${
                router.route == "/files/photos" && styles.selected
              }`}
            >
              <PhotoIcon className={styles.icon} />
              <div className={styles.details}>
                <div className={styles.name}>Photo</div>
                {/* <div className={styles.data}>1,4475 files | 13.4 GB</div> */}
                <div className={styles.data}>
                  {memory("image", sizes).total} files |{" "}
                  {byteSize(memory("image", sizes).size).value}{" "}
                  {byteSize(memory("image", sizes).size).unit}
                </div>
              </div>
            </div>
          </Link>

          <Link href="/files/videos">
            <div
              className={`${styles.item} ${
                router.route == "/files/videos" && styles.selected
              }`}
            >
              <VideocamIcon className={styles.icon} />
              <div className={styles.details}>
                <div className={styles.name}>Video</div>
                <div className={styles.data}>
                  {" "}
                  {memory("video", sizes).total} files |{" "}
                  {byteSize(memory("video", sizes).size).value}{" "}
                  {byteSize(memory("video", sizes).size).unit}
                </div>
              </div>
            </div>
          </Link>

          <Link href="/files/docs">
            <div
              className={`${styles.item} ${
                router.route == "/files/docs" && styles.selected
              }`}
            >
              <ArticleIcon className={styles.icon} />
              <div className={styles.details}>
                <div className={styles.name}>Document</div>
                <div className={styles.data}>
                  {memory("application", sizes).total} files |{" "}
                  {byteSize(memory("application", sizes).size).value}{" "}
                  {byteSize(memory("application", sizes).size).unit}
                </div>
              </div>
            </div>
          </Link>

          <Link href="/files/audios">
            <div
              className={`${styles.item} ${
                router.route == "/files/audios" && styles.selected
              }`}
            >
              <AudioFileIcon className={styles.icon} />
              <div className={styles.details}>
                <div className={styles.name}>Audio</div>
                <div className={styles.data}>
                  {" "}
                  {memory("audio", sizes).total} files |{" "}
                  {byteSize(memory("audio", sizes).size).value}{" "}
                  {byteSize(memory("audio", sizes).size).unit}
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
      <div className={styles.database}>
        <div className={styles.cirlce}>
          <CircularProgressbarWithChildren
            strokeWidth={7}
            value={(memory("", sizes).size / (1024 * 1024 * 1024)) * 100}
            styles={buildStyles({
              textColor: "red",
              pathColor: "white",
              trailColor: "gold",
            })}
          >
            <div
              className={styles.innerValue}
              style={{ fontSize: "120%", fontWeight: "bold" }}
            >
              {" "}
              {((memory("", sizes).size / (1024 * 1024 * 1024)) * 100).toFixed(
                1
              )}{" "}
              %
            </div>
            <div className={styles.text} style={{ fontSize: "80%" }}>
              Used
            </div>
          </CircularProgressbarWithChildren>
        </div>
        <div className={styles.used}>
          <div className={styles.bold}>
            {byteSize(memory("", sizes).size).value}
            {byteSize(memory("", sizes).size).unit}
          </div>
          <div className={styles.normal}>
            of {byteSize(1024 * 1024 * 1024).value}
            {byteSize(1024 * 1024 * 1024).unit} used
          </div>
        </div>
      </div>
    </div>
  );
};
export default Left;
