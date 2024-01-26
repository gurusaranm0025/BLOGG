import "@/app/globals.css";
import Providers from "@/common/ContextProvider";

export const metadata = {
  title: "Bloom | Account Sign in / Sign up",
  description: "Bloom Blog project by GS.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredericka+the+Great&family=Montserrat:wght@200;400;600&family=Noto+Sans:wght@200;400;600&family=Poppins:wght@400;500;600&family=Raleway:wght@200;400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <Providers>
        <body>{children}</body>
      </Providers>
    </html>
  );
}
