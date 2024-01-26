import SideNav from "@/components/Settings/SideNav";

function SettingsLayout({ children }) {
  return (
    <>
      <SideNav>{children}</SideNav>
    </>
  );
}

export default SettingsLayout;
