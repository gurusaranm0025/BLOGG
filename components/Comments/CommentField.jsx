"use client";
import { UserContext } from "@/common/ContextProvider";
import { addComment } from "@/server/fetchBlogs";
import { useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BlogContext } from "../BlogPage/BlogPage";

function CommentField({
  action,
  index = undefined,
  replyingTo = undefined,
  setReplying,
}) {
  let {
    blog,
    blog: {
      _id,
      author: { _id: blog_author },
      comments,
      comments: { results: commentsArr },
      activity,
      activity: { total_comments, total_parent_comments },
    },
    setBlog,
    setTotalParentCommentsLoaded,
  } = useContext(BlogContext);
  let {
    userAuth: { access_token, username, fullname, profile_img },
  } = useContext(UserContext);
  const [comment, setComment] = useState("");

  function handleComments() {
    if (!access_token) {
      return toast.error("Sign in to leave a comment");
    }

    if (!comment.length) {
      return toast.error("Write something to comment.");
    }

    addComment({
      token: access_token,
      _id,
      blog_author,
      comment,
      replying_to: replyingTo,
    })
      .then((response) => {
        setComment("");
        response.commented_by = {
          personal_info: { username, fullname, profile_img },
        };

        let newCommentArr;

        if (replyingTo) {
          commentsArr[index].children.push(response._id);
          response.childrenLevel = commentsArr[index].childrenLevel + 1;
          response.parentIndex = index;
          commentsArr[index].isReplyLoaded = true;

          commentsArr.splice(index + 1, 0, response);

          newCommentArr = commentsArr;

          setReplying(false);
        } else {
          response.childrenLevel = 0;

          newCommentArr = [response, ...commentsArr];
        }

        let parentCommentIncrementVal = replyingTo ? 0 : 1;

        setBlog({
          ...blog,
          comments: { ...comments, results: newCommentArr },
          activity: {
            ...activity,
            total_comments: total_comments + 1,
            total_parent_comments:
              total_parent_comments + parentCommentIncrementVal,
          },
        });

        setTotalParentCommentsLoaded(
          (preVal) => preVal + parentCommentIncrementVal
        );
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
  return (
    <>
      <Toaster />
      <textarea
        value={comment}
        placeholder="Leave a comment"
        onChange={(e) => setComment(e.target.value)}
        className="input-box bg-gray-300/50 focus:bg-white outline-none focus:outline-french-gray duration-300 pl-5 placeholder:text-cadet-gray resize-none h-[150px] overflow-auto"
      ></textarea>
      <button
        onClick={handleComments}
        className="btn-dark mt-5 px-10 capitalize"
      >
        {action}
      </button>
    </>
  );
}

export default CommentField;
