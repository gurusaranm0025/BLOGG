"use client";
import { usePathname } from "next/navigation";
import NavBar from "../NavBar/NavBar";

function LayoutProvider({ children }) {
  const pathname = usePathname();
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
