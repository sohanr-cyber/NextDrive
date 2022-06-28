import React, { useEffect, useState } from "react";
import styles from "../styles/Navbar.module.css";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";

import Search from "./Search";
import Image from "next/image";
import { useRouter } from "next/router";
import { logout } from "../redux/userSlice";
import { clearRecent } from "../redux/fileSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const userInfo = useSelector((state) => state.user.userInfo);
  const [open, setOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const handleSignOut = () => {
    dispatch(logout());
    dispatch(clearRecent());
    router.push("/login");
  };

  console.log({ userInfo });

  return (
    <>
      <div className={styles.wrapper}>
        <div onClick={() => router.push("/")}>
          {" "}
          <div className={styles.logo2}>
            <Image src="/assets/cloud.png" width="30px" height="30px" alt="" />
          </div>
          <div className={styles.logo}>
            NEXT<span>DRIVE</span>
          </div>
        </div>
        {userInfo && (
          <div className={styles.search}>
            <input
              type="text"
              className={styles.field}
              onClick={() => setOpen(true)}
            />
          </div>
        )}

        <div className={styles.profile}>
          <div
            className={styles.pic}
            onClick={() => setOpenProfile((prev) => !prev)}
          >
            {userInfo &&
              (userInfo.user?.pic ? (
                <Image
                  src={userInfo.user?.pic}
                  width="28px"
                  height="28px"
                  alt=""
                />
              ) : (
                <Image
                  src="/assets/user.png"
                  width="28px"
                  height="28px"
                  alt=""
                />
              ))}
          </div>
          {openProfile && (
            <div className={styles.borderWrapper}>
              {" "}
              <div className={styles.profileWrapper}>
                <div className={styles.photo}>
                  {userInfo && userInfo.user?.pic ? (
                    <Image
                      src={userInfo.user.pic}
                      width="45px"
                      height="45px"
                      alt=""
                    />
                  ) : (
                    <Image
                      src="/assets/user.png"
                      width="45px"
                      height="45px"
                      alt=""
                    />
                  )}
                </div>
                <div className={styles.name}>{userInfo?.user.name}</div>
                <div className={styles.email}>{userInfo?.user.email}</div>
                <div
                  className={styles.btn}
                  onClick={() => router.push("/register")}
                >
                  Add Another Account
                </div>
                <div className={styles.flex}>
                  <div className={styles.btn} onClick={() => handleSignOut()}>
                    Sign out
                  </div>
                  <div
                    className={styles.btn}
                    onClick={() => setOpenProfile(false)}
                  >
                    Cancel
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {open && <Search setOpen={setOpen} />}
    </>
  );
};

export default Navbar;
