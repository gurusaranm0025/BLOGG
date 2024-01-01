"use client";
import { SettingsContext, UserContext } from "@/common/ContextProvider";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";

function SideNav({ children }) {
  const router = useRouter();
  let { pageState, setPageState } = useContext(SettingsContext);

  let activeTabLine = useRef();
  let sideBarIconTab = useRef();
  let pageStateTab = useRef();

  // const [pageState, setPageState] = useState(null);
  let [showSideNav, setShowSideNav] = useState(false);

  useEffect(() => {
    let page = location.pathname.split("/")[2].replace("-", " ");
    setPageState(page);
  }, []);

  const {
    userAuth: { access_token },
  } = useContext(UserContext);

  function changePageState(e) {
    let { offsetWidth, offsetLeft } = e.target;

    activeTabLine.current.style.width = offsetWidth + "px";
    activeTabLine.current.style.left = offsetLeft + "px";

    if (e.target == sideBarIconTab.current) {
      setShowSideNav(true);
    } else {
      setShowSideNav(false);
    }
  }

  return access_token === null ? (
    router.push("/account/signin")
  ) : (
    <section className="relative flex gap-10 py-0 m-0 max-md:flex-col">
      <div className="sticky top-[75px] z-30">
        <div className="md:hidden bg-white py-1 border-b border-gray-300 flex flex-nowrap overflow-x-auto">
          <button
            ref={sideBarIconTab}
            onClick={changePageState}
            className="p-5"
          >
            <i className="fa-solid fa-bars-staggered pointer-events-none"></i>
          </button>
          <button
            ref={pageStateTab}
            onClick={changePageState}
            className="p-5 capitalize"
          >
            {pageState}
          </button>
          <hr
            ref={activeTabLine}
            className="absolute bottom-3 duration-500 border-black"
          />
        </div>

        <div
          className={
            "min-w-[200px] h-[calc(100vh-75px-60px)] md:h-cover md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-gray-300 md:border-r absolute max-md:top-[64px] bg-white w-[calc(100%+75px)] max-md:px-16 max-md:-ml-7 duration-500 " +
            (!showSideNav
              ? "max-md:opacity-0 max-md:pointer-events-none"
              : "opacity-100 pointer-events-auto")
          }
        >
          <h1 className="text-xl text-cadet-gray mb-3">DASHBOARD</h1>
          <hr className="border-cadet-gray -ml-6 mb-8 mr-6" />

          <Link
            href={"/dashboard/blogs"}
            onClick={(e) => setPageState(e.target.innerText)}
            className={
              "sidebar-link " +
              (pageState == "Blogs" ? "sidebar-link-active" : "")
            }
          >
            <i className="fa-solid fa-file"></i>
            Blogs
          </Link>

          <Link
            href={"/dashboard/notification"}
            onClick={(e) => setPageState(e.target.innerText)}
            className={
              "sidebar-link " +
              (pageState == "Notification" ? "sidebar-link-active" : "")
            }
          >
            <i className="fa-solid fa-bell"></i>
            Notification
          </Link>

          <Link
            href={"/editor"}
            onClick={(e) => setPageState(e.target.innerText)}
            className={
              "sidebar-link " +
              (pageState == "Write" ? "sidebar-link-active" : "")
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
              "sidebar-link " +
              (pageState == "Edit Profile" ? "sidebar-link-active" : "")
            }
          >
            <i className="fa-regular fa-user"></i> Edit Profile
          </Link>

          <Link
            href={"/settings/change-password"}
            onClick={(e) => setPageState(e.target.innerText)}
            className={
              " sidebar-link " +
              (pageState == "Change Password" ? "sidebar-link-active" : "")
            }
          >
            <i className="fa-solid fa-lock"></i> Change Password
          </Link>
        </div>
      </div>

      <div className="max-md:-mt-8 mt-5 w-full ">{children}</div>
    </section>
  );
}

export default SideNav;
