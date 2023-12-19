"use client";
import { UserContext } from "@/common/ContextProvider";
import BlogEditor from "@/components/BlogEditor/BlogEditor";
import PublishForm from "@/components/PublishForm/PublishForm";
import { useRouter } from "next/navigation";
import { createContext, useContext, useState } from "react";

const blogStructure = {
  title: "",
  banner: "",
  content: [],
  tags: [],
  des: "",
  author: { personal_info: {} },
};

export const EditorContext = createContext({});

function page() {
  const [blog, setBlog] = useState(blogStructure);
  const router = useRouter();
  const {
    userAuth: { access_token },
  } = useContext(UserContext);
  const [editorState, setEditorState] = useState("editor");

  const [textEditor, setTextEditor] = useState({ isReady: false });

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
      {access_token === null ? router.push("/signin") : ""}
      {editorState === "editor" ? <BlogEditor /> : <PublishForm />}
    </EditorContext.Provider>
  );
}

export default page;
