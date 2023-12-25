"use client";
import { useContext, useEffect } from "react";
import { BlogContext } from "./BlogPage";
import Link from "next/link";
import { UserContext } from "@/common/ContextProvider";
import toast, { Toaster } from "react-hot-toast";
import { getIsLikedByUser, likeBlog } from "@/server/fetchBlogs";

function BlogInteraction() {
  let {
    blog,
    blog: {
      _id,
      blog_id,
      title,
      activity,
      activity: { total_likes, total_comments },
      author: {
        personal_info: { username: auhtorUsername },
      },
    },
    setBlog,
    isLikedByUser,
    setIsLikedByUser,
  } = useContext(BlogContext);

  let {
    userAuth: { username, access_token },
  } = useContext(UserContext);

  useEffect(() => {
    if (access_token) {
      //make request to server to check whether the user has liked the post or not
      getIsLikedByUser({ token: access_token, _id })
        .then((data) => {
          if (data.status == 200) {
            setIsLikedByUser(Boolean(data.result));
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, []);

  function handleLike(e) {
    if (access_token) {
      //like the blog
      setIsLikedByUser((preVal) => !preVal);
      !isLikedByUser ? total_likes++ : total_likes--;
      setBlog({ ...blog, activity: { ...activity, total_likes } });

      likeBlog({ token: access_token, _id, isLikedByUser }).then((data) =>
        console.log(data)
      );
    } else {
      //not logged in
      toast.error("Sign in to like this blog");
    }
  }

  return (
    <>
      <Toaster />
      <hr className="border-cadet-gray/50 my-2 " />
      <div className="flex gap-6 justify-between">
        <div className="flex gap-3 items-center">
          <button
            className={
              "w-10 h-10 flex items-center rounded-full justify-center " +
              (isLikedByUser ? "bg-red-300/50 " : "bg-gray-300/50 ")
            }
            onClick={handleLike}
          >
            <i
              className={
                "fa-heart text-xl " +
                (isLikedByUser
                  ? "fa-solid text-red-600/80 "
                  : "fa-regular text-gunmetal-2 ")
              }
            ></i>
          </button>

          <p className="text-lg text-gunmetal">{total_likes}</p>

          <button className="w-10 h-10 flex items-center rounded-full justify-center bg-gray-300/50">
            <i className="fa-regular fa-comments text-lg text-gunmetal-2"></i>
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
