import { useContext } from "react";
import { BlogContext } from "./BlogPage";
import {
  ChatBubbleBottomCenterIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { UserContext } from "@/common/ContextProvider";

function BlogInteraction() {
  let {
    blog: {
      blog_id,
      title,
      activity,
      activity: { total_likes, total_comments },
      author: {
        personal_info: { username: auhtorUsername },
      },
    },
    setBlog,
  } = useContext(BlogContext);

  let {
    userAuth: { username },
  } = useContext(UserContext);

  return (
    <>
      <hr className="border-cadet-gray/50 my-2 " />
      <div className="flex gap-6 justify-between">
        <div className="flex gap-3 items-center">
          <button className="w-10 h-10 flex items-center rounded-full justify-center bg-gray-300/80">
            <HeartIcon className="w-[1.5rem]" />
          </button>

          <p className="text-lg text-gunmetal">{total_likes}</p>

          <button className="w-10 h-10 flex items-center rounded-full justify-center bg-gray-300/80">
            <ChatBubbleBottomCenterIcon className="w-[1.5rem]" />
          </button>

          <p className="text-lg text-gunmetal">{total_comments}</p>
        </div>

        <div className="flex gap-6 items-center">
          {username == auhtorUsername ? (
            <Link
              href={`/editor/${blog_id}`}
              className="underline hover:text-purple-400 duration-200"
            >
              Edit
            </Link>
          ) : (
            ""
          )}

          <Link
            href={`https://twitter.com/intent/tweet?/text=Read ${title}&url=${location.href}`}
          >
            <i className="fa-brands fa-x-twitter text-xl hover:text-blue-600 duration-200"></i>
          </Link>
        </div>
      </div>
      <hr className="border-cadet-gray/50 my-2 " />
    </>
  );
}

export default BlogInteraction;
