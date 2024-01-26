"use client";
import { usePathname } from "next/navigation";
import NavBar from "../NavBar/NavBar";

function LayoutProvider({ children }) {
  const pathname = usePathname();

  console.log("pathname =>", pathname);

  return (
    <>
      {pathname.includes("/account") || pathname.includes("/editor") ? (
        ""
      ) : (
        <NavBar />
      )}
      {children}
    </>
  );
}

export default LayoutProvider;
