import BlogPage from "@/components/BlogPage/BlogPage";
import NavBar from "@/components/NavBar/NavBar";

function page({ params }) {
  return (
    <>
      <NavBar />
      <BlogPage blogId={params.blog_id} />
    </>
  );
}

export default page;
