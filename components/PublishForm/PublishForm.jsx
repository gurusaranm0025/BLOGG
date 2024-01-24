import toast, { Toaster } from "react-hot-toast";
import AnimationWrapper from "../pageAnimation/AnimationWrapper";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useContext } from "react";
import { EditorContext } from "../Editor/EditorPage";
import Tags from "./Tags";
import { createBlog } from "@/server/publishBlog";
import { UserContext } from "@/common/ContextProvider";
import { useParams, useRouter } from "next/navigation";

function PublishForm() {
  const router = useRouter();
  let { blog_id } = useParams();

  let {
    setEditorState,
    blog,
    blog: { banner, title, content, tags, des },
    setBlog,
  } = useContext(EditorContext);

  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  function CloseEventHandler() {
    setEditorState("editor");
  }

  function blogTitleChangeHandler(e) {
    setBlog({ ...blog, title: e.target.value });
  }

  function desChangeHandler(e) {
    setBlog({ ...blog, des: e.target.value });
  }

  function onKeyDownHandler(e) {
    if (e.keyCode == 13) {
      e.preventDefault();
    }
  }

  function tagsKeyDownHandler(e) {
    if (e.keyCode == 13 || e.keyCode == 188) {
      e.preventDefault();
      let tag = e.target.value;

      if (tags.length < 10) {
        if (!tags.includes(tag) && tag.length) {
          setBlog({ ...blog, tags: [...tags, tag] });
        }
      } else {
        toast.error("You can't add more than 10 blocks");
      }

      e.target.value = "";
    }
  }

  async function publishHandler(e) {
    e.preventDefault();
    if (e.target.className.includes("disable")) return;

    const loadingToast = toast.loading("Publishing...");
    e.target.classList.add("disable");

    let blogObj = { title, des, banner, content, tags, draft: false };

    createBlog(access_token, {
      ...blogObj,
      id: blog_id,
    })
      .then((response) => {
        e.target.classList.remove("disable");

        toast.dismiss(loadingToast);

        if (response.status == 500) {
          console.error(response.error);
          toast.error(response.message);
        } else {
          setTimeout(() => {
            router.push("/dashboard/blogs"), 500;
          });
          toast.success("Published successfully");
        }
      })
      .catch((err) => {
        toast.dismiss(loadingToast);
        toast.error("failed");
        console.log(err.message);
      });
  }

  return (
    <AnimationWrapper>
      <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
        <Toaster />
        <button
          className="h-12 w-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
          onClick={CloseEventHandler}
        >
          <XMarkIcon className="w-[1.5rem]" />
        </button>

        <div className="max-w-[550px] w-full center ">
          <p className="text-cadet-gray mb-1">Preview</p>

          <div className="w-full aspect-video overflow-hidden rounded-lg bg-gray-300 mt-4">
            <img src={banner} alt="" />
          </div>

          <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">
            {title}
          </h1>
          <p className="font-noto text-xl leading-7 line-clamp-2 mt-4">{des}</p>
        </div>

        <div className="border-gray-300 lg:border-1 lg:pl-8">
          <p className="mb-2 mt-9 text-gunmetal">Blog Title</p>
          <input
            className="input-box pl-4 outline-none focus:outline-french-gray/80 border-none bg-french-gray/50 focus:bg-white hover:bg-grey duration-300"
            type="text"
            placeholder="Blog title"
            defaultValue={title}
            onChange={blogTitleChangeHandler}
          />

          <p className="mb-2 mt-9 text-gunmetal">
            Short description of the blog
          </p>

          <textarea
            maxLength={200}
            defaultValue={des}
            onChange={desChangeHandler}
            onKeyDown={onKeyDownHandler}
            className="h-40 resize-none leading-7 input-box pl-4 outline-none focus:outline-french-gray/30 hover:bg-grey bg-french-gray/60 duration-300 focus:bg-white border-none"
          ></textarea>
          <p className="mt-1 text-gunmetal text-sm text-right">
            {200 - des.length} characters left.
          </p>

          <p className="text-gunmetal mb-2 mt-9">
            Topics - (Help in searching and ranking your blog post.)
          </p>

          <div className="relative input-box pl-2 py-2 pb-4 bg-french-gray/60 border-none">
            <input
              type="text"
              placeholder="Topics"
              onKeyDown={tagsKeyDownHandler}
              className="sticky top-0 left-0 pl-4 mb-3 input-box bg-french-gray/60 hover:bg-grey focus:bg-white outline-none focus:border-2 focus:outline-french-gray/30 duration-300 placeholder:text-black"
            />

            {tags.map((tag, index) => {
              return <Tags tag={tag} tagIndex={index} key={index} />;
            })}
          </div>
          <p className="mt-1 mb-4 text-gunmetal text-sm text-right">
            {10 - tags.length} tags left
          </p>

          <button className="btn-dark px-8" onClick={publishHandler}>
            Publish
          </button>
        </div>
      </section>
    </AnimationWrapper>
  );
}

export default PublishForm;
