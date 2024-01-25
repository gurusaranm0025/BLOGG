"use client";

import { lookInSession } from "./session";
const { createContext, useState, useEffect } = require("react");

export const UserContext = createContext({});
export const ThemeContext = createContext({});

function darkThemePreference() {
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
}

export default function Providers({ children }) {
  const [userAuth, setUserAuth] = useState({});
  const [theme, setTheme] = useState(() =>
    darkThemePreference() ? "dark" : "light"
  );

  useEffect(() => {
    const userSession = lookInSession("user");
    const themeInSession = lookInSession("theme");

    userSession
      ? setUserAuth(JSON.parse(userSession))
      : setUserAuth({ access_token: null });

    if (themeInSession) {
      setTheme(() => {
        document.body.setAttribute("data-theme", themeInSession);

        return themeInSession;
      });
    } else {
      document.body.setAttribute("data-theme", theme);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <UserContext.Provider value={{ userAuth, setUserAuth }}>
        {children}
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}
