"use client";
import { useContext, useState } from "react";
import { getDay } from "../HomePage/BlogPostCard/date";
import { UserContext } from "@/common/ContextProvider";
import toast, { Toaster } from "react-hot-toast";
import CommentField from "./CommentField";
import { BlogContext } from "../BlogPage/BlogPage";
import { getReplies } from "@/server/fetchBlogs";

function CommentCard({ index, leftVal, commentData }) {
  let {
    commented_by: {
      personal_info: { profile_img, username, fullname },
    },
    commentedAt,
    comment,
    _id,
    children,
  } = commentData;

  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  let {
    blog,
    blog: {
      comments,
      comments: { results: commentsArr },
    },
    setBlog,
  } = useContext(BlogContext);

  const [isReplying, setIsReplying] = useState(false);

  function handleReply() {
    if (!access_token) {
      toast.error("Sign in to reply.");
    }

    setIsReplying((preVal) => !preVal);
  }

  function removeCommentCard(startingPoint) {
    if (commentsArr[startingPoint]) {
      while (
        commentsArr[startingPoint].childrenLevel > commentData.childrenLevel
      ) {
        commentsArr.splice(startingPoint, 1);

        if (!commentsArr[startingPoint]) {
          break;
        }
      }
    }

    setBlog({ ...blog, comments: { results: commentsArr } });
  }

  function handleHideReplies() {
    commentData.isReplyLoaded = false;

    removeCommentCard(index + 1);
  }

  function handleLoadReplies({ skip = 0 }) {
    if (children.length) {
      handleHideReplies();

      getReplies({ _id, skip })
        .then((response) => {
          console.log(response);
          commentData.isReplyLoaded = true;

          for (let i = 0; i < response.replies.length; i++) {
            response.replies[i].childrenLevel = commentData.childrenLevel + 1;

            commentsArr.splice(index + 1 + i + skip, 0, response.replies[i]);
          }

          setBlog({ ...blog, comments: { ...comments, results: commentsArr } });
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }

  return (
    <div className="w-full" style={{ paddingLeft: `${leftVal * 10}px` }}>
      <div className="my-5 p-6 rounded-md border border-gray-300/50 ">
        <div className="flex gap-3 items-center mb-8">
          <img
            src={profile_img}
            alt="profile-img"
            className="h-6 w-6 rounded-full"
          />

          <p className="line-clamp-1">
            {fullname} @{username}
          </p>
          <p className="min-w-fit">{getDay(commentedAt)}</p>
        </div>

        <p className="font-poppins text-xl ml-3">{comment}</p>

        <div className="flex gap-5 items-center mt-5">
          {commentData.isReplyLoaded ? (
            <button
              className="text-cadet-gray p-2 px-3 hover:bg-gray-300/30 rounded-md flex items-center gap-2"
              onClick={handleHideReplies}
            >
              Hide Reply
            </button>
          ) : (
            <button
              className="text-cadet-gray p-2 px-3 hover:bg-gray-300/30 rounded-md flex items-center gap-2"
              onClick={handleLoadReplies}
            >
              {children.length} replies
            </button>
          )}

          <button className="underline" onClick={handleReply}>
            reply
          </button>
        </div>

        {isReplying ? (
          <div className="mt-8">
            <CommentField
              action="reply"
              index={index}
              replyingTo={_id}
              setReplying={setIsReplying}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default CommentCard;
