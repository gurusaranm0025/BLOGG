"use client";

import { useContext, useEffect, useState } from "react";
import Logo from "../Logo/Logo";
import {
  BellIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { ThemeContext, UserContext } from "@/common/ContextProvider";
import UserNavigationPanel from "./UserNavigationPanel";
import { useRouter } from "next/navigation";

// import { newNotification } from "@/server/fetchBlogs";

import { storeInSession } from "@/common/session";
import axios from "axios";

function NavBar({ className }) {
  const router = useRouter();
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
  const [userNavPanel, setUserNavPanel] = useState(false);

  const {
    userAuth,
    userAuth: { access_token, profile_img, new_notification_available },
    setUserAuth,
  } = useContext(UserContext);

  let { theme, setTheme } = useContext(ThemeContext);

  useEffect(() => {
    if (access_token) {
      //new code
      axios
        .post(
          process.env.NEXT_PUBLIC_SERVER_DOMAIN + "/newNotifications",
          {},
          { headers: { Authorization: `Bearer ${access_token}` } }
        )
        .then(({ data: { new_notification_available } }) => {
          setUserAuth({ ...userAuth, new_notification_available });
        });

      //old code
      // newNotification({ token: access_token }).then(
      //   ({ new_notification_available }) => {
      //     setUserAuth({ ...userAuth, new_notification_available });
      //   }
      // );
    }
  }, [access_token]);

  function handleSearch(e) {
    let query = e.target.value;

    if (e.keyCode == 13 && query.length) {
      router.push(`/search/${query}`);
    }
  }

  function changeTheme() {
    let newTheme = theme == "dark" ? "light" : "dark";

    setTheme(newTheme);

    document.body.setAttribute("data-theme", newTheme);

    storeInSession("theme", newTheme);
  }

  return (
    <nav className={"navbar z-50 " + className}>
      <a href="/" className="max-md:w-[20%]">
        <Logo />
      </a>

      <div
        className={
          "absolute bg-white md:min-w-[150px] w-full md:w-auto left-0 top-full mt-0.5 border-b border-french-gray/80 py-[15px] px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:show " +
          (searchBoxVisibility ? "show" : "hide")
        }
      >
        <input
          type="text"
          placeholder="Search"
          onKeyDown={handleSearch}
          className="peer w-full bg-grey/50 p-[15px] pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-black outline-none outline-rose-quartz/30 m-0 focus:outline-rose-quartz focus:bg-grey duration-300 md:pl-14 focus:placeholder:text-rose-quartz"
        />
        <MagnifyingGlassIcon className="absolute w-[1.5rem] right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 md:w-[1.3rem] stroke-black peer-focus:stroke-rose-quartz" />
      </div>

      <div className="flex max-md:w-[60%] max-md:justify-end items-center gap-3 md:gap-6 ml-auto">
        <button
          className="md:hidden bg-grey hover:bg-rose-quartz/20 outline-none hover:outline-rose-quartz/30 duration-300 w-12 h-12 rounded-full flex items-center justify-center"
          onClick={() => setSearchBoxVisibility((currVal) => !currVal)}
        >
          <MagnifyingGlassIcon className="w-[1.5rem]" />
        </button>

        <a
          href="/editor"
          className="hidden md:flex gap-2 text-french-gray hover:text-black rounded-lg bg-grey/50 outline-none hover:outline-rose-quartz/30 hover:bg-rose-quartz/20 p-3 px-4 duration-300"
        >
          <PencilSquareIcon className="w-[1.1rem]" />
          <p>Write</p>
        </a>

        <button
          className="w-12 h-12 bg-grey rounded-full relative hover:bg-rose-quartz/20 outline-none hover:outline-rose-quartz/30 duration-300"
          onClick={changeTheme}
        >
          {theme == "dark" ? (
            <SunIcon className="w-[1.5rem] block mx-auto my-auto" />
          ) : (
            <MoonIcon className="w-[1.5rem] block mx-auto my-auto" />
          )}
        </button>

        {access_token ? (
          <>
            <a href="/dashboard/notification">
              <button className="w-12 h-12 bg-grey rounded-full relative hover:bg-french-gray/30 duration-300">
                <BellIcon className="w-[1.5rem] block mx-auto my-auto" />
                {new_notification_available ? (
                  <span className="bg-red w-3 h-3 rounded-full absolute z-10 top-2 right-2"></span>
                ) : (
                  ""
                )}
              </button>
            </a>

            <div
              className="relative"
              onClick={() => setUserNavPanel((curVal) => !curVal)}
              onBlur={() =>
                setTimeout(() => {
                  setUserNavPanel(false);
                }, 200)
              }
            >
              <button className="w-12 h-12 mr-1 mt-1 hover:opacity-70 duration-300">
                <img
                  src={profile_img}
                  className="w-full h-full object-cover rounded-full"
                  alt="profile image"
                />
              </button>
              {userNavPanel ? <UserNavigationPanel /> : ""}
            </div>
          </>
        ) : (
          <>
            <a href="/account/signin" className="btn-dark py-3 duration-300">
              Sign In
            </a>
            <a
              href="/account/signup"
              className="btn-light py-3 hidden md:block duration-300"
            >
              Sign Up
            </a>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
