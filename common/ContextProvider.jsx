"use client";

import { lookInSession } from "./session";
const { createContext, useState, useEffect } = require("react");

export const UserContext = createContext({});

export default function Providers({ children }) {
  const [userAuth, setUserAuth] = useState({});

  useEffect(() => {
    const userSession = lookInSession("user");
    userSession
      ? setUserAuth(JSON.parse(userSession))
      : setUserAuth({ access_token: null });
  }, []);

  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      {children}
    </UserContext.Provider>
  );
}
