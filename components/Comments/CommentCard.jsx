"use client";
import { useContext, useState } from "react";
import { getDay } from "../HomePage/BlogPostCard/date";
import { UserContext } from "@/common/ContextProvider";
import toast, { Toaster } from "react-hot-toast";
import CommentField from "./CommentField";
import { BlogContext } from "../BlogPage/BlogPage";
import { deleteComment, getReplies } from "@/server/fetchBlogs";

function CommentCard({ index, leftVal, commentData }) {
  let {
    commented_by: {
      personal_info: { profile_img, username: commented_by_username, fullname },
    },
    commentedAt,
    comment,
    _id,
    children,
  } = commentData;

  let {
    userAuth: { access_token, username },
  } = useContext(UserContext);

  let {
    blog,
    blog: {
      comments,
      activity,
      activity: { total_comments, total_parent_comments },
      comments: { results: commentsArr },
      author: {
        personal_info: { username: author_username },
      },
    },
    setBlog,
    setTotalParentCommentsLoaded,
  } = useContext(BlogContext);

  const [isReplying, setIsReplying] = useState(false);

  function getParentIndex() {
    let startingPoint = index - 1;

    try {
      while (
        commentsArr[startingPoint].childrenLevel >= commentData.childrenLevel
      ) {
        startingPoint--;
      }
    } catch {
      startingPoint = undefined;
    }

    return startingPoint;
  }

  function handleReply() {
    if (!access_token) {
      toast.error("Sign in to reply.");
    }

    setIsReplying((preVal) => !preVal);
  }

  function removeCommentCard(startingPoint, isDelete = false) {
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

    if (isDelete) {
      let parentIndex = getParentIndex();

      if (parentIndex != undefined) {
        commentsArr[parentIndex].children = commentsArr[
          parentIndex
        ].children.filter((child) => child != _id);

        if (commentsArr[parentIndex].children.length) {
          commentsArr[parentIndex].isReplyLoaded = false;
        }
      }

      commentsArr.splice(index, 1);
    }

    if (commentData.childrenLevel == 0 && isDelete) {
      setTotalParentCommentsLoaded((preVal) => preVal - 1);
    }

    setBlog({
      ...blog,
      comments: { results: commentsArr },
      activity: {
        ...activity,
        total_comments: total_comments - 1,
        total_parent_comments:
          total_parent_comments - commentData.childrenLevel == 0 && isDelete
            ? 1
            : 0,
      },
    });
  }

  function handleHideReplies() {
    commentData.isReplyLoaded = false;

    removeCommentCard(index + 1);
  }

  function handleLoadReplies({ skip = 0, currentIndex = index }) {
    if (commentsArr[currentIndex].children.length) {
      handleHideReplies();

      getReplies({ _id: commentsArr[currentIndex]._id, skip })
        .then((response) => {
          commentsArr[currentIndex].isReplyLoaded = true;

          for (let i = 0; i < response.replies.length; i++) {
            response.replies[i].childrenLevel =
              commentsArr[currentIndex].childrenLevel + 1;

            commentsArr.splice(
              currentIndex + 1 + i + skip,
              0,
              response.replies[i]
            );
          }

          setBlog({ ...blog, comments: { ...comments, results: commentsArr } });
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }

  function handleDeleteComment(e) {
    e.target.setAttribute("disable", true);

    deleteComment({ _id, token: access_token })
      .then(() => {
        e.target.removeAttribute("disable");
        removeCommentCard(index + 1, true);
      })
      .catch((err) => {
        console.log(err.message);
      });

    console.log("click");
  }

  function LoadMoreRepliesBtn() {
    let parentIndex = getParentIndex();

    let button = (
      <button
        onClick={() =>
          handleLoadReplies({
            skip: index - parentIndex,
            currentIndex: parentIndex,
          })
        }
        className="text-cadet-gray p-2 px-3 hover:bg-gray-300/30 rounded-md flex items-center gap-2"
      >
        Load more replies
      </button>
    );

    if (commentsArr[index + 1]) {
      if (
        commentsArr[index + 1].childrenLevel < commentsArr[index].childrenLevel
      ) {
        if (index - parentIndex < commentsArr[parentIndex].children.length) {
          return button;
        }
      }
    } else {
      if (parentIndex) {
        if (index - parentIndex < commentsArr[parentIndex].children.length) {
          return button;
        }
      }
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
            {fullname} @{commented_by_username}
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

          {username == commented_by_username || username == author_username ? (
            <button
              className="group duration-200 p-3 px-3 rounded-md border border-gray-300 ml-auto hover:bg-red-500/30 flex items-center "
              onClick={handleDeleteComment}
            >
              <i class="fa-solid fa-trash group-hover:text-red-500 duration-200"></i>
            </button>
          ) : (
            ""
          )}
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

      <LoadMoreRepliesBtn />
    </div>
  );
}

export default CommentCard;
