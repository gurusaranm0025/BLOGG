"use client";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import AnimationWrapper from "../pageAnimation/AnimationWrapper";
import { useContext } from "react";
import { UserContext } from "@/common/ContextProvider";
import { removeFromSession } from "@/common/session";
import Link from "next/link";

function UserNavigationPanel() {
  const {
    userAuth: { username },
    setUserAuth,
  } = useContext(UserContext);

  function signOUtUser() {
    removeFromSession("user");
    setUserAuth({ access_token: null });
  }
  return (
    <AnimationWrapper
      className="absolute right-0 z-50"
      transition={{ duration: 0.2 }}
    >
      <div className="absolute bg-white right-0 border border-french-gray/50 w-60 duration-300">
        <Link
          href="/editor"
          className="flex gap-2 text-french-gray hover:text-black hover:bg-french-gray/30 p-3 px-4 duration-300 md:hidden pl-8 py-4 "
        >
          <PencilSquareIcon className="w-[1.5rem]" />
          <p>Write</p>
        </Link>
        <Link
          href={`/user/${username}`}
          className="text-french-gray hover:text-black hover:bg-french-gray/30 p-3 px-4 pl-8 py-4 duration-300 block"
        >
          Profile
        </Link>
        <Link
          href="/dashboard/blogs"
          className="text-french-gray hover:text-black hover:bg-french-gray/30 p-3 px-4 pl-8 py-4 duration-300 block"
        >
          Dashboard
        </Link>
        <Link
          href="/settings/edit-profile"
          className="text-french-gray hover:text-black hover:bg-french-gray/30 p-3 px-4 pl-8 py-4 duration-300 block"
        >
          Settings
        </Link>
        <span className="absolute border-t border-cadet-gray/70 w-[100%]"></span>
        <button
          className="text-left text-black p-4 hover:text-black hover:bg-french-gray/30 w-full pl-8 px-4 duration-300"
          onClick={signOUtUser}
        >
          <h1 className="font-bold text-xl mb-1">Sign out</h1>
          <p className="text-cadet-gray ">@{username}</p>
        </button>
      </div>
    </AnimationWrapper>
  );
}

export default UserNavigationPanel;
