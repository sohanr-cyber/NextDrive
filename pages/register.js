import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import styles from "../styles/Sign.module.css";
import { useRouter } from "next/router";
import axios from "axios";
import { storage } from "../firebase";
import { useSelector, useDispatch } from "react-redux";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { login } from "../redux/userSlice";
import CircularProgress from "@mui/material/CircularProgress";

const Register = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(null);
  const [file, setFile] = useState("");
  const [pic, setPic] = useState(null);
  const [progresspercent, setProgresspercent] = useState("");
  const [uploading, setUploading] = useState(false);

  console.log({ file });
  console.log({ progresspercent });

  const userInfo = useSelector((state) => state.user.userInfo);

  const handleFile = (file) => {
    console.log("file upload starred");
    if (!file) return;
    console.log("uploading...");
    setUploading(true);

    const storageRef = ref(storage, `profile/${file.name}`);
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
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setPic(downloadURL);
          setUploading(false);
          setFile("");
        });
      }
    );
  };

  const handleRegister = async () => {
    console.log({ name, email, password });
    if (name == "" || email == "" || password == "") {
      return;
    }
    try {
      const { data } = await axios.post("/api/user/register", {
        name,
        pic,
        password,
        email,
      });
      console.log({ data });
      setFile(null);
      setPic(null);
      dispatch(login(data));

      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.wrapper}>
        <div className={styles.form_container}>
          <div className={styles.top}>
            <div
              className={styles.btn}
              onClick={() => router.push("/register")}
              style={{
                fontWeight: "bolder",
                color: "white",
              }}
            >
              Register
            </div>
            <div className={styles.btn} onClick={() => router.push("/login")}>
              Login
            </div>
          </div>
          <form className={styles.label}>
            <input
              type="text"
              placeholder="Name"
              className={styles.field}
              required
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Email"
              className={styles.field}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className={styles.field}
              onChange={(e) => setPassword(e.target.value)}
            />
            {uploading ? (
              <></>
            ) : (
              <div className={styles.relative}>
                <input
                  type="file"
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                    handleFile(e.target.files[0]);
                  }}
                />
              </div>
            )}
          </form>
          {uploading ? (
            <div
              className={styles.submit}
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              <CircularProgress variant="determinate" value={progresspercent} />
            </div>
          ) : (
            <div className={styles.submit} onClick={() => handleRegister()}>
              Submit
            </div>
          )}

          <div className={styles.auth}></div>
        </div>
      </div>
    </>
  );
};

export default Register;
