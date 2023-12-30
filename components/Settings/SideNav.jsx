"use client";
import { UserContext } from "@/common/ContextProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

function SideNav() {
  const router = useRouter();
  const [pageState, setPageState] = useState();

  const {
    userAuth: { access_token },
  } = useContext(UserContext);

  return access_token === null ? (
    router.push("/account/signin")
  ) : (
    <section className="relative flex gap-10 py-0 m-0 max-md:flex-col">
      <div className="sticky top-[75px] z-30">
        <div className="min-w-[200px] h-cover md:sticky top-24 overflow-y-auto p-6 md:pr-0">
          <h1 className="text-xl text-cadet-gray mb-3">DASHBOARD</h1>
          <hr className="border-cadet-gray -ml-6 mb-8 mr-6" />

          <Link
            href={"/dashboard/blogs"}
            onClick={(e) => setPageState(e.target.innerText)}
            className="sidebar-link"
          >
            <i className="fa-solid fa-file"></i>
            Blogs
          </Link>

          <Link
            href={"/dashboard/notification"}
            onClick={(e) => setPageState(e.target.innerText)}
            className={
              "sidebar-link " + (pageState == "" ? "sidebar-link-active" : "")
            }
          >
            <i className="fa-solid fa-bell"></i>
            Notification
          </Link>

          <Link
            href={"/editor"}
            onClick={(e) => setPageState(e.target.innerText)}
            className={
              "sidebar-link " + (pageState == "" ? "sidebar-link-active" : "")
            }
          >
            <i className="fa-regular fa-pen-to-square"></i>
            Write
          </Link>

          <h1 className="mt-20 text-xl text-cadet-gray mb-3">SETTINGS</h1>
          <hr className="border-cadet-gray -ml-6 mb-8 mr-6" />

          <Link
            href={"/settings/edit-profile"}
            onClick={(e) => setPageState(e.target.innerText)}
            className={
              "sidebar-link " + (pageState == "" ? "sidebar-link-active" : "")
            }
          >
            <i className="fa-regular fa-pen-to-square"></i>
            Edit profile
          </Link>

          <Link
            href={"/settings/change-password"}
            onClick={(e) => setPageState(e.target.innerText)}
            className={
              "capitalize sidebar-link " +
              (pageState == "change password" ? "sidebar-link-active" : "")
            }
          >
            <i className="fa-regular fa-pen-to-square"></i>
            change password
          </Link>
        </div>
      </div>
    </section>
  );
}

export default SideNav;
