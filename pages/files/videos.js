import Head from "next/Head";
import React, { useState, useEffect } from "react";
import Left from "../../components/Left";
import Mid from "../../components/Mid";
import Navbar from "../../components/Navbar";
import Right from "../../components/Right";
import styles from "../../styles/Home.module.css";
import Files from "../../components/Files";
import Folder from "../../components/Folder";
import NavRouter from "../../components/NavRouter";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useRouter } from "next/router";
import cookie from "cookie";
import { currentFolder, recent } from "../../redux/folderSlice";
import FilesByCategory from "../../components/FilesByCategory";

const Folders = ({ data }) => {
  const [fetchAgain, setFetchAgain] = useState(true);
  const [videos, setVideos] = useState(data);
  const router = useRouter();
  const dispatch = useDispatch();

  const userInfo = useSelector((state) => state.user.userInfo);
  console.log({ videos });

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.container}>
        <Navbar />
        <div className={styles.main}>
          <div className={styles.left}>
            <Left />
          </div>
          <div className={styles.mid}>
            <NavRouter current={"Videos"} />
            <FilesByCategory
              isVideo={true}
              files={videos}
              setFiles={setVideos}
            />
          </div>
          <div className={styles.right}>
            <Right />
          </div>
        </div>
      </div>
    </>
  );
};

export default Folders;

export async function getServerSideProps(context) {
  const parsedCookies = cookie.parse(
    context.req.headers.cookie ? context.req.headers.cookie : ""
  );
  const userInfo = parsedCookies.userInfo;

  if (!userInfo) {
    return { props: {}, redirect: "/login" };
  }

  const token = JSON.parse(userInfo).token;

  const { data } = await axios.get("http://localhost:3000/api/file/video", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return {
    props: { data },
  };
}