"use client";
import { ThemeContext } from "@/common/ContextProvider";
import { useContext, useEffect, useState } from "react";

function Logo({ className }) {
  let { theme } = useContext(ThemeContext);

  const [themedCSS, setThemedCSS] = useState("bg-logo-gradient ");

  useEffect(() => {
    setThemedCSS(() => {
      if (theme === "dark") {
        return "bg-logo-gradient-dark ";
      } else {
        return "bg-logo-gradient ";
      }
    });
  }, [theme]);

  return (
    <span
      className={
        "text-4xl font-logo bg-clip-text text-transparent " +
        themedCSS +
        className
      }
    >
      BLOGG
    </span>
  );
}

export default Logo;
