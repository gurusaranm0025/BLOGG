"use client";
import { useEffect, useRef, useState } from "react";

export let activeTabLineRef;
export let activeTabRef;

function InPageNavigation({
  routes,
  defaultHidden = [],
  defaultActiveIndex = 0,
  children,
}) {
  activeTabLineRef = useRef();
  activeTabRef = useRef();
  const [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex);

  const [isResizeEventAdded, setIsResizeEventAdded] = useState(false);
  let tempWindowWidth;
  if (typeof window !== "undefined") {
    tempWindowWidth = window.innerWidth;
  }
  const [width, setWidth] = useState(tempWindowWidth);

  useEffect(() => {
    if (width > 766 && inPageNavIndex != defaultActiveIndex) {
      changePageState(activeTabRef.current, defaultActiveIndex);
    }

    if (!isResizeEventAdded) {
      window.addEventListener("resize", () => {
        if (!isResizeEventAdded) {
          setIsResizeEventAdded(true);
        }

        setWidth(window.innerWidth);
      });
    }
  }, [width]);

  function changePageState(btn, index) {
    let { offsetWidth, offsetLeft } = btn;

    activeTabLineRef.current.style.width = offsetWidth + "px";
    activeTabLineRef.current.style.left = offsetLeft + "px";

    setInPageNavIndex(index);
  }

  return (
    <>
      <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
        {routes.map((route, i) => {
          return (
            <button
              ref={i == defaultActiveIndex ? activeTabRef : null}
              key={i}
              className={
                "p-4 px-5 capitalize hover:bg-rose-quartz/10 rounded-t-lg duration-300 " +
                (inPageNavIndex == i ? "text-black" : "text-cadet-gray ") +
                (defaultHidden.includes(route) ? " md:hidden" : "")
              }
              onClick={(e) => {
                changePageState(e.target, i);
              }}
            >
              {route}
            </button>
          );
        })}

        <hr
          ref={activeTabLineRef}
          className="absolute bottom-0 border-french-gray duration-300"
        />
      </div>

      {Array.isArray(children) ? children[inPageNavIndex] : children}
    </>
  );
}

export default InPageNavigation;
