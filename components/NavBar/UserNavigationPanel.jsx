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
      <div className="absolute bg-white right-0 border border-gray-300 w-60 duration-200">
        <Link
          href="/editor"
          className="flex gap-2 link md:hidden pl-8 py-4 duration-200"
        >
          <PencilSquareIcon className="w-[1.5rem]" />
          <p>Write</p>
        </Link>
        <Link
          href={`/user/${username}`}
          className="link pl-8 py-4 duration-200"
        >
          Profile
        </Link>
        <Link href="/dashboard/blogs" className="link pl-8 py-4 duration-200">
          Dashboard
        </Link>
        <Link
          href="/settings/edit-profile"
          className="link pl-8 py-4 duration-200"
        >
          Settings
        </Link>
        <span className="absolute border-t border-cadet-gray/70 w-[100%]"></span>
        <button
          className="text-left p-4 hover:bg-gray-300 w-full pl-8 px-4"
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
