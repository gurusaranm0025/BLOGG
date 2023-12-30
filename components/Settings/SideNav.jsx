"use client";
import { UserContext } from "@/common/ContextProvider";
import { useRouter } from "next/navigation";
import { useContext } from "react";

function SideNav() {
  const router = useRouter();
  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  return (
    <>{access_token == null ? router.push("/account/signin") : "Side nav"}</>
  );
}

export default SideNav;
