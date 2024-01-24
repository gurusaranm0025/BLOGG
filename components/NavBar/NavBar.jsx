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
import Link from "next/link";
import { newNotification } from "@/server/fetchBlogs";
import { storeInSession } from "@/common/session";

function NavBar() {
  const router = useRouter();
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
  const [userNavPanel, setUserNavPanel] = useState(false);

  const {
    userAuth,
    userAuth: { access_token, profile_img, new_notification_available },
    setUserAuth,
  } = useContext(UserContext);

  let { theme, setTheme } = useContext(ThemeContext);

  function handleSearch(e) {
    let query = e.target.value;

    if (e.keyCode == 13 && query.length) {
      router.push(`/search/${query}`);
    }
  }

  useEffect(() => {
    if (access_token) {
      newNotification({ token: access_token }).then(
        ({ new_notification_available }) => {
          setUserAuth({ ...userAuth, new_notification_available });
          ``;
        }
      );
    }
  }, [access_token]);

  function changeTheme() {
    let newTheme = theme == "dark" ? "light" : "dark";

    setTheme(newTheme);

    document.body.setAttribute("data-theme", newTheme);

    storeInSession("theme", newTheme);
  }

  return (
    <nav className="navbar z-50">
      <Link href="/">
        <Logo />
      </Link>

      <div
        className={
          "absolute bg-white w-full left-0 top-full mt-0.5 border-b border-french-gray py-[15px] px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " +
          (searchBoxVisibility ? "show" : "hide")
        }
      >
        <input
          type="text"
          placeholder="Search"
          onKeyDown={handleSearch}
          className="peer w-full md:w-auto bg-grey p-[15px] pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-[#FFFFFF] outline-none m-0 focus:outline-gunmetal focus:bg-french-gray duration-300 focus:placeholder:text-white md:pl-14"
        />
        <MagnifyingGlassIcon className="absolute w-[1.5rem] right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 md:w-[1.3rem] stroke-black peer-focus:stroke-white" />
      </div>

      <div className="flex items-center gap-3 md:gap-6 ml-auto">
        <button
          className="md:hidden bg-grey hover:bg-french-gray/30 duration-300 w-12 h-12 rounded-full flex items-center justify-center"
          onClick={() => setSearchBoxVisibility((currVal) => !currVal)}
        >
          <MagnifyingGlassIcon className="w-[1.5rem]" />
        </button>

        <Link
          href="/editor"
          className="hidden md:flex gap-2 text-french-gray hover:text-black rounded-lg bg-grey/50 hover:bg-french-gray/30 p-3 px-4 duration-300"
        >
          <PencilSquareIcon className="w-[1.1rem]" />
          <p>Write</p>
        </Link>

        <button
          className="w-12 h-12 bg-grey rounded-full relative hover:bg-french-gray/30 duration-300"
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
            <Link href="/dashboard/notification">
              <button className="w-12 h-12 bg-grey rounded-full relative hover:bg-french-gray/30 duration-300">
                <BellIcon className="w-[1.5rem] block mx-auto my-auto" />
                {new_notification_available ? (
                  <span className="bg-red w-3 h-3 rounded-full absolute z-10 top-2 right-2"></span>
                ) : (
                  ""
                )}
              </button>
            </Link>

            <div
              className="relative"
              onClick={() => setUserNavPanel((curVal) => !curVal)}
              onBlur={() =>
                setTimeout(() => {
                  setUserNavPanel(false);
                }, 200)
              }
            >
              <button className="w-12 h-12 mt-1">
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
            <Link href="/account/signin" className="btn-dark py-2 duration-200">
              Sign In
            </Link>
            <Link
              href="/account/signup"
              className="btn-light py-2 hidden md:block duration-200"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
