"use client";
import { useEffect, useRef, useState } from "react";

function InPageNavigation({
  routes,
  defaultHidden,
  defaultActiveIndex = 0,
  children,
}) {
  let activeTabLineRef = useRef();
  let activeTabRef = useRef();
  let [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex);

  useEffect(() => {
    changePageState(activeTabRef.current, defaultActiveIndex);
  }, []);

  function changePageState(btn, index) {
    let { offsetWidth, offsetLeft } = btn;

    activeTabLineRef.current.style.width = offsetWidth + "px";
    activeTabLineRef.current.style.left = offsetLeft + "px";

    setInPageNavIndex(index);
  }

  return (
    <>
      <div className="relative mb-8 bg-white border-b border-gray-200 flex flex-nowrap overflow-x-auto">
        {routes.map((route, i) => {
          return (
            <button
              ref={i == defaultActiveIndex ? activeTabRef : null}
              key={i}
              className={
                "p-4 px-5 capitalize " +
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
          className="absolute bottom-0 border-black duration-300"
        />
      </div>

      {Array.isArray(children) ? children[inPageNavIndex] : children}
    </>
  );
}

export default InPageNavigation;
