"use client";
import { UserContext } from "@/common/ContextProvider";
import BlogEditor from "@/components/BlogEditor/BlogEditor";
import PublishForm from "@/components/PublishForm/PublishForm";
import { useParams, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import { getBlog } from "@/server/fetchBlogs";

const blogStructure = {
  title: "",
  banner: "",
  content: [],
  tags: [],
  des: "",
  author: { personal_info: {} },
};

export const EditorContext = createContext({});

function EditorPage() {
  let { blog_id } = useParams();

  const [blog, setBlog] = useState(blogStructure);
  const router = useRouter();
  const {
    userAuth: { access_token },
  } = useContext(UserContext);
  const [editorState, setEditorState] = useState("editor");

  const [textEditor, setTextEditor] = useState({ isReady: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!blog_id) {
      return setLoading(false);
    }

    getBlog({ blog_id, draft: true, mode: "edit" })
      .then((data) => {
        setBlog(data.blog);
        setLoading(false);
      })
      .catch((err) => {
        setBlog(null);
        setLoading(false);
        console.log(err.message);
      });
  }, []);

  return (
    <EditorContext.Provider
      value={{
        blog,
        setBlog,
        editorState,
        setEditorState,
        textEditor,
        setTextEditor,
      }}
    >
      {access_token === null ? (
        router.push("/account/signin/page.html")
      ) : loading ? (
        <Loader />
      ) : editorState === "editor" ? (
        <BlogEditor />
      ) : (
        <PublishForm />
      )}
    </EditorContext.Provider>
  );
}

export default EditorPage;
