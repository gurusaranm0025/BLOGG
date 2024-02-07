import BlogPage from "@/components/BlogPage/BlogPage";
// import NavBar from "@/components/NavBar/NavBar";

export function generateStaticParams() {
  return [{}];
}

function page({ params }) {
  return (
    <>
      <BlogPage blogId={params.blog_id} />
    </>
  );
}

export default page;
