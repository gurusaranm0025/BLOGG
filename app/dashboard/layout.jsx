import SideNav from "@/components/Settings/SideNav";

function DashBoardLayout({ children }) {
  return (
    <>
      <SideNav>{children}</SideNav>
    </>
  );
}

export default DashBoardLayout;
