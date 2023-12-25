import EditorPage from "@/components/Editor/EditorPage";

function page({ params }) {
  const blog_id = params.blog_id;

  return <EditorPage />;
}

export default page;
