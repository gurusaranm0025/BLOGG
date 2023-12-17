"use client";
import { UserContext } from "@/common/ContextProvider";
import BlogEditor from "@/components/BlogEditor/BlogEditor";
import PublishForm from "@/components/PublishForm/PublishForm";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

function page() {
  const router = useRouter();
  const {
    userAuth: { access_token },
  } = useContext(UserContext);
  const [editorState, setEditorState] = useState("editor");

  //   access_token === null ? router.push("/signin") : "";

  return (
    <div>
      {access_token === null ? router.push("/signin") : ""}
      {editorState === "editor" ? <BlogEditor /> : <PublishForm />}
    </div>
  );
}

export default page;
