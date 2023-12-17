"use client";

import { useContext, useState } from "react";
import Logo from "../Logo/Logo";
import { BellIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { UserContext } from "@/common/ContextProvider";
import Link from "next/link";
import UserNavigationPanel from "./UserNavigationPanel";

function NavBar() {
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
  const [userNavPanel, setUserNavPanel] = useState(false);

  const {
    userAuth,
    userAuth: { access_token, profile_img },
  } = useContext(UserContext);

  return (
    <nav className="navbar">
      <a href="/">
        <Logo />
      </a>

      <div
        className={
          "absolute bg-white w-full left-0 top-full mt-0.5 border-b border-french-gray py-[15px] px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " +
          (searchBoxVisibility ? "show" : "hide")
        }
      >
        <input
          type="text"
          placeholder="Search"
          className="w-full md:w-auto bg-gray-300 p-[15px] pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-gunmetal outline-none m-0 focus:outline-gunmetal focus:bg-cadet-gray duration-300 focus:placeholder:text-white hover:bg-french-gray md:pl-14"
        />
        <MagnifyingGlassIcon className="absolute w-[1.5rem] right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 md:w-[1.3rem]" />
      </div>

      <div className="flex items-center gap-3 md:gap-6 ml-auto">
        <button
          className="md:hidden bg-gray-300 w-12 h-12 rounded-full flex items-center justify-center"
          onClick={() => setSearchBoxVisibility((currVal) => !currVal)}
        >
          <MagnifyingGlassIcon className="w-[1.5rem]" />
        </button>

        <a
          href="/editor"
          className="hidden md:flex gap-2 link rounded-[5px] duration-200 "
        >
          <PencilSquareIcon className="w-[1.1rem]" />
          <p>Write</p>
        </a>

        {access_token ? (
          <>
            <a href="/dashboard/notification">
              <button className="w-12 h-12 bg-gray-300 rounded-full relative hover:bg-black/10 duration-150">
                <BellIcon className="w-[1.5rem] block mx-auto my-auto" />
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
            <a href="/signin" className="btn-dark py-2 duration-200">
              Sign In
            </a>
            <a
              href="/signup"
              className="btn-light py-2 hidden md:block duration-200"
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
