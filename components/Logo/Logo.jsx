"use client";
import { ThemeContext } from "@/common/ContextProvider";
import { useContext } from "react";

function Logo({ className }) {
  let { theme } = useContext(ThemeContext);

  return (
    <span
      className={
        "text-4xl font-logo bg-clip-text text-transparent " +
        (theme == "dark" ? "bg-logo-gradient-dark " : "bg-logo-gradient ") +
        className
      }
    >
      BLOOM
    </span>
  );
}

export default Logo;
