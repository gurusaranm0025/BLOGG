"use client";
import { useContext, useEffect } from "react";
import { BlogContext } from "./BlogPage";
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
    setCommentsWrapper,
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
      <hr className="border-french-gray/60 my-2 " />
      <div className="flex gap-6 justify-between">
        <div className="flex gap-3 items-center">
          <button
            className={
              "w-10 h-10 flex items-center rounded-full justify-center hover:bg-red/10 duration-300 " +
              (isLikedByUser ? "bg-red/20 " : "bg-grey ")
            }
            onClick={handleLike}
          >
            <i
              className={
                "fi fi-rr-heart text-2xl " +
                (isLikedByUser ? " fi-sr-heart text-red " : " text-black ")
              }
            ></i>
          </button>

          <p className="text-lg text-gunmetal">{total_likes}</p>

          <button
            className="w-10 h-10 flex items-center rounded-full justify-center bg-grey hover:bg-rose-quartz/10 duration-300"
            onClick={() => setCommentsWrapper((curVal) => !curVal)}
          >
            <i className="fi fi-rr-comment-alt text-2xl text-black"></i>
          </button>

          <p className="text-lg text-gunmetal">{total_comments}</p>
        </div>

        <div className="flex gap-6 items-center">
          {username == auhtorUsername ? (
            <a
              href={`/editor/${blog_id}`}
              className="underline text-black hover:text-rose-quartz duration-300"
            >
              Edit
            </a>
          ) : (
            ""
          )}

          <a
            href={`https://twitter.com/intent/tweet?/text=Read ${title}&url=${location.href}`}
          >
            <i className="fi fi-brands-twitter-alt text-2xl text-black hover:text-rose-quartz duration-300"></i>
          </a>
        </div>
      </div>
      <hr className="border-french-gray/60 my-2 " />
    </>
  );
}

export default BlogInteraction;
