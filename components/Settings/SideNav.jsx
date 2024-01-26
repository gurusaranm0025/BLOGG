"use client";
import { UserContext } from "@/common/ContextProvider";
import { Bars3BottomLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";

function SideNav({ children }) {
  const router = useRouter();

  let activeTabLine = useRef();
  let sideBarIconTab = useRef();
  let pageStateTab = useRef();

  const [pageState, setPageState] = useState("");
  let [showSideNav, setShowSideNav] = useState(false);

  useEffect(() => {
    let page = location.pathname.split("/")[2].replace("-", " ");
    setPageState(page);
  }, []);
  console.log("page => ", pageState);

  const {
    userAuth: { access_token, new_notification_available },
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
        <div className="md:hidden bg-white py-1 border-b border-french-gray/10 flex flex-nowrap overflow-x-auto">
          <button
            ref={sideBarIconTab}
            onClick={changePageState}
            className="p-5 hover:opacity-70 duration-300"
          >
            <Bars3BottomLeftIcon className="w-[1.2rem] md:w-[1.5rem] pointer-events-none" />
          </button>
          <button
            ref={pageStateTab}
            onClick={changePageState}
            className="p-5 capitalize hover:opacity-70 duration-300"
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
            "min-w-[200px] h-[calc(100vh-75px-60px)] md:h-cover md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-french-gray/60 md:border-r absolute max-md:top-[64px] bg-white w-[calc(100%+75px)] max-md:px-16 max-md:-ml-7 duration-500 " +
            (!showSideNav
              ? "max-md:opacity-0 max-md:pointer-events-none"
              : "opacity-100 pointer-events-auto")
          }
        >
          <h1 className="text-xl text-gunmetal mb-3">DASHBOARD</h1>
          <hr className="border-french-gray/60 -ml-6 mb-8 mr-6" />

          <a
            href={"/dashboard/blogs"}
            onClick={(e) => setPageState(e.target.innerText.toLowerCase())}
            className={
              "sidebar-link " +
              (pageState == "blogs" ? "sidebar-link-active" : "")
            }
          >
            <i className="fa-solid fa-file"></i>
            Blogs
          </a>

          <a
            href={"/dashboard/notification"}
            onClick={(e) => setPageState(e.target.innerText.toLoweCase())}
            className={
              "sidebar-link " +
              (pageState == "notification" ? "sidebar-link-active" : "")
            }
          >
            <div className="relative">
              <i className="fa-solid fa-bell text-lg"></i>
              {new_notification_available ? (
                <span className="bg-red-500 w-2 h-2 rounded-full absolute z-10 top-0 right-0"></span>
              ) : (
                ""
              )}
            </div>
            Notification
          </a>

          <a
            href={"/editor"}
            onClick={(e) => setPageState(e.target.innerText)}
            className={
              "sidebar-link " +
              (pageState == "Write" ? "sidebar-link-active" : "")
            }
          >
            <i className="fa-regular fa-pen-to-square"></i>
            Write
          </a>

          <h1 className="mt-20 text-xl text-gunmetal mb-3">SETTINGS</h1>
          <hr className="border-french-gray/60 -ml-6 mb-8 mr-6" />

          <a
            href={"/settings/edit-profile"}
            onClick={(e) => setPageState(e.target.innerText.toLowerCase())}
            className={
              "sidebar-link " +
              (pageState == "edit profile" ? "sidebar-link-active" : "")
            }
          >
            <i className="fa-regular fa-user"></i> Edit Profile
          </a>

          <a
            href={"/settings/change-password"}
            onClick={(e) => setPageState(e.target.innerText.toLowerCase())}
            className={
              " sidebar-link " +
              (pageState == "change password" ? "sidebar-link-active" : "")
            }
          >
            <i className="fa-solid fa-lock"></i> Change Password
          </a>
        </div>
      </div>

      <div className="max-md:-mt-8 md:pl-14 mt-5 w-full ">{children}</div>
    </section>
  );
}

export default SideNav;
