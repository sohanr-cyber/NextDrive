import React, { useEffect, useState } from "react";
import styles from "../styles/Navbar.module.css";
import Link from "next/link";
import { useSelector } from "react-redux";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import ImageIcon from "@mui/icons-material/Image";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import axios from "axios";
import { useRouter } from "next/router";
import { fileName } from "../utils/helper";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import FolderIcon from "@mui/icons-material/Folder";

const Search = ({ setOpen }) => {
  const [query, setQuery] = useState(null);
  const [results, setResults] = useState({ files: [], folders: [] });
  const userInfo = useSelector((state) => state.user.userInfo);
  const [type, setType] = useState("all");
  const router = useRouter();
  const [searching, setSearching] = useState(false);

  const fetch = async () => {
    if (query == null || query.trim() == "") {
      return;
    }
    try {
      setSearching(true);
      const { data } = await axios.get(
        `/api/search?query=${query}&type=${type}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      setSearching(false);

      console.log(data);
      setResults((prev) => ({
        ...prev,
        files: data.files,
        folders: data.folders,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = (value) => {
    type == value ? setType("all") : setType(value);
  };
  useEffect(() => {
    fetch();
  }, [query, type]);

  return (
    <div className={styles.boxContainer}>
      <div className={styles.box}>
        <div className={styles.field}>
          <input
            type="text"
            placeholder="Search here"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <span onClick={() => setOpen(false)}>X</span>
        <div className={styles.searchResults}>
          {searching ? (
            <>Searching</>
          ) : (
            <>
              {" "}
              {results.folders?.map((i, k) => (
                <>
                  <div
                    className={styles.item}
                    key={k}
                    onClick={() => {
                      setOpen(false);
                      router.push(`/folder/${i._id}`);
                    }}
                  >
                    <FolderIcon className={styles.icon} />
                    <div className={styles.name}>{i.name}</div>
                  </div>
                </>
              ))}
              {results.folders.length > 0 && (
                <>
                  <hr />
                </>
              )}
              {results?.files
                // .filter((item) => item.type.includes(type))
                .map((i, k) => (
                  <a target="_blank" rel="noreferrer" href={i.url} key={k}>
                    <div className={styles.item}>
                      {i.type.includes("image") ? (
                        <ImageIcon />
                      ) : i.type.includes("video") ? (
                        <VideoFileIcon />
                      ) : i.type.includes("application") ? (
                        <PictureAsPdfIcon />
                      ) : i.type.includes("audio") ? (
                        <AudioFileIcon />
                      ) : (
                        <InsertDriveFileIcon />
                      )}

                      <div className={styles.name}>{fileName(i, 30)}</div>
                    </div>
                  </a>
                ))}
            </>
          )}
        </div>
        <div className={styles.filters}>
          <div className={styles.filter}>
            <ImageIcon
              className={`${styles.icon} ${
                type == "image" && styles.activeIcon
              }`}
              onClick={() => {
                handleClick("image");
              }}
            />
          </div>
          <div className={styles.filter}>
            <PictureAsPdfIcon
              className={`${styles.icon} ${
                type == "application" && styles.activeIcon
              }`}
              onClick={() => {
                handleClick("application");
              }}
            />
          </div>
          <div className={styles.filter}>
            <VideoFileIcon
              className={`${styles.icon} ${
                type == "video" && styles.activeIcon
              }`}
              onClick={() => {
                handleClick("video");
              }}
            />
          </div>
          <div className={styles.filter}>
            <AudioFileIcon
              className={`${styles.icon} ${
                type == "audio" && styles.activeIcon
              }`}
              onClick={() => {
                handleClick("audio");
              }}
            />
          </div>

          <div className={styles.filter}>
            <FolderIcon
              className={`${styles.icon} ${
                type == "folder" && styles.activeIcon
              }`}
              onClick={() => {
                handleClick("folder");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
