import "@/app/globals.css";
import Providers from "@/common/ContextProvider";
import NavBar from "@/components/NavBar/NavBar";
import SideNav from "@/components/Settings/SideNav";

export const metadata = {
  title: "Create Next App",
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
        {/* Font Awesome */}
        <script
          src="https://kit.fontawesome.com/d01381783e.js"
          crossOrigin="anonymous"
        ></script>
      </head>
      <Providers>
        <body>
          <NavBar />
          <SideNav />
          {children}
        </body>
      </Providers>
    </html>
  );
}
