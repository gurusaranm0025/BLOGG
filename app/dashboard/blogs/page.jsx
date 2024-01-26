import DashBoardBlogsPage from "@/components/PageComponents/dashboard/blogs/DashboardBlogsPage";
import { Suspense } from "react";

function page() {
  return (
    <Suspense>
      <DashBoardBlogsPage />
    </Suspense>
  );
}

export default page;
