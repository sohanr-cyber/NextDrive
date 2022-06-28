import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import styles from "../styles/Sign.module.css";
import { useRouter } from "next/router";
import axios from "axios";
import { storage } from "../firebase";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";

import { login } from "../redux/userSlice";

const Register = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (email, password) => {
    try {
      if (password == "" || email == "") return;
      const { data } = await axios.post("/api/user/login", {
        password,
        email,
      });
      console.log({ data });
      dispatch(login(data));
      enqueueSnackbar("Successfully Logged In", { variant: "success" });
      router.push("/");
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
      console.log(error);
    }
  };

  useEffect(() => {
    if (userInfo) {
      router.push("/");
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className={styles.wrapper}>
        <div className={styles.form_container}>
          <div className={styles.top}>
            <div
              className={styles.btn}
              onClick={() => router.push("/register")}
            >
              Register
            </div>
            <div
              className={styles.btn}
              onClick={() => router.push("/login")}
              style={{
                fontWeight: "Bolder",
                color: "white",
              }}
            >
              Login
            </div>
          </div>
          <form className={styles.label}>
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
          </form>
          <div
            className={styles.submit}
            onClick={() => handleLogin(email, password)}
          >
            Submit
          </div>
          <div
            className={styles.submit}
            onClick={() => handleLogin("sohanur@gmail.com", "sohanur123")}
          >
            Login As Guest User
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
