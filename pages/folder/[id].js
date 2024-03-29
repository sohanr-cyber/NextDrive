import Head from "next/head";
import React, { useState, useEffect } from "react";
import Left from "../../components/Left";
import Navbar from "../../components/Navbar";
import Right from "../../components/Right";
import styles from "../../styles/Home.module.css";
import Files from "../../components/Files";
import Folder from "../../components/Folder";
import NavRouter from "../../components/NavRouter";
import { useSelector, useDispatch } from "react-redux";
import cookie from "cookie";
import axios from "axios";
import { useRouter } from "next/router";
import { currentFolder, recent } from "../../redux/folderSlice";
import { filesbyFolder } from "../../redux/fileSlice";

const Folders = ({ id, currentDirectory, path }) => {
  const [fetchAgain, setFetchAgain] = useState(true);
  const [fetchFileAgain, setFetchFileAgain] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const [folders, setFolders] = useState([]);

  const userInfo = useSelector((state) => state.user.userInfo);
  const files = useSelector((state) => state.file.currentFiles);

  const fetchFiles = async () => {
    try {
      const { data } = await axios.get(`/api/file/${router.query.id}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      dispatch(filesbyFolder(data));
    } catch (error) {
      console.log(error);
    }
  };

  const fetch = async () => {
    try {
      const { data } = await axios.get(`/api/folders/${id}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      setFolders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }
    dispatch(currentFolder(currentDirectory));
  }, [id]);


  useEffect(() => {
    fetch();
  }, [id]);

  
  useEffect(() => {
    fetchFiles();
  }, [id, fetchFileAgain]);

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
            <NavRouter path={path} current={currentDirectory.name} />
            <Folder
              folders={folders}
              setFetchAgain={setFetchAgain}
              setFolders={setFolders}
            />
            <Files
              files={files}
              inFolder={true}
              setFetchFileAgain={setFetchFileAgain}
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
  const { params } = context;
  const { id } = params;
  const parsedCookies = cookie.parse(
    context.req.headers.cookie ? context.req.headers.cookie : ""
  );
  const userInfo = parsedCookies.userInfo;

  if (!userInfo) {
    return { props: {}, redirect: "/login" };
  }

  const token = JSON.parse(userInfo).token;

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/api/folder/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const resp = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/api/folder/path/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return {
    props: { currentDirectory: data, id, path: resp.data },
  };
}
