import { useContext } from "react";
import { BlogContext } from "../BlogPage/BlogPage";
import { XMarkIcon } from "@heroicons/react/24/outline";
import CommentField from "./CommentField";

function CommentsContainer() {
  let {
    blog: { title },
    commentsWrapper,
    setCommentsWrapper,
  } = useContext(BlogContext);
  return (
    <div
      className={
        "max-sm:w-full fixed " +
        (commentsWrapper ? "top-0 sm:right-0" : "top-[100%] sm:right-[-100%]") +
        " duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden"
      }
    >
      <div className="relative">
        <h1 className="text-xl font-medium">Comments</h1>
        <p className="text-lg mt-2 w-[70%] text-cadet-gray line-clamp-1">
          {title}
        </p>

        <button
          className="absolute top-0 right-0 flex items-center justify-center w-12 h-12 rounded-full bg-gray-300/50"
          onClick={() => setCommentsWrapper((curVal) => !curVal)}
        >
          <XMarkIcon className="w-[2rem] absolute" />
        </button>
      </div>
      <hr className="border-gray-300  my-8 w-[120%] -ml-10 " />

      <CommentField action={"comment"} />
    </div>
  );
}

export default CommentsContainer;
