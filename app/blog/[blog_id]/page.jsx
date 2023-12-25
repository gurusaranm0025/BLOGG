import BlogPage from "@/components/BlogPage/BlogPage";

function page({ params }) {
  return (
    <>
      <BlogPage blogId={params.blog_id} />
    </>
  );
}

export default page;
