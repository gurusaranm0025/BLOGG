"use client";
import { useContext, useState } from "react";
import { getDay } from "../HomePage/BlogPostCard/date";
import { UserContext } from "@/common/ContextProvider";
import toast from "react-hot-toast";
import CommentField from "./CommentField";
import { BlogContext } from "../BlogPage/BlogPage";

// import { deleteComment, getReplies } from "@/server/fetchBlogs";
import axios from "axios";

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
      //new code
      axios
        .post(process.env.NEXT_PUBLIC_SERVER_DOMAIN + "/getReplies", {
          _id: commentsArr[currentIndex]._id,
          skip,
        })
        .then(({ data }) => {
          commentsArr[currentIndex].isReplyLoaded = true;

          for (let i = 0; i < data.replies.length; i++) {
            data.replies[i].childrenLevel =
              commentsArr[currentIndex].childrenLevel + 1;

            commentsArr.splice(currentIndex + 1 + i + skip, 0, data.replies[i]);
          }

          setBlog({ ...blog, comments: { ...comments, results: commentsArr } });
        })
        .catch((err) => {
          console.log(err.message);
        });

      //old code
      // getReplies({ _id: commentsArr[currentIndex]._id, skip })
      //   .then((response) => {
      //     commentsArr[currentIndex].isReplyLoaded = true;

      //     for (let i = 0; i < response.replies.length; i++) {
      //       response.replies[i].childrenLevel =
      //         commentsArr[currentIndex].childrenLevel + 1;

      //       commentsArr.splice(
      //         currentIndex + 1 + i + skip,
      //         0,
      //         response.replies[i]
      //       );
      //     }

      //     setBlog({ ...blog, comments: { ...comments, results: commentsArr } });
      //   })
      //   .catch((err) => {
      //     console.log(err.message);
      //   });
    }
  }

  function handleDeleteComment(e) {
    e.target.setAttribute("disable", true);
    //new code
    axios
      .post(
        process.env.NEXT_PUBLIC_SERVER_DOMAIN + "/deleteComment",
        { _id },
        { headers: { Authorization: `Bearer ${access_token}` } }
      )
      .then(({ data }) => {
        e.target.removeAttribute("disable");
        removeCommentCard(index + 1, true);
      })
      .catch((err) => {
        console.log(err.message);
      });

    //old code
    // deleteComment({ _id, token: access_token })
    //   .then(() => {
    //     e.target.removeAttribute("disable");
    //     removeCommentCard(index + 1, true);
    //   })
    //   .catch((err) => {
    //     console.log(err.message);
    //   });
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
        className="text-black p-2 px-3 outline-none hover:outline-rose-quartz/30 hover:bg-rose-quartz/10 rounded-md flex items-center gap-2 duration-300"
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
      <div className="my-5 p-6 rounded-md border border-french-gray/40 ">
        <div className="flex gap-3 items-center mb-8">
          <img
            src={profile_img}
            alt="profile-img"
            className="h-6 w-6 rounded-full"
          />

          <p className="line-clamp-1 text-sm md:text-lg">
            {fullname} @{commented_by_username}
          </p>
          <p className="min-w-fit text-sm md:text-lg">{getDay(commentedAt)}</p>
        </div>

        <p className="font-poppins text-xl ml-3">{comment}</p>

        <div className="flex gap-5 items-center mt-5">
          {commentData.isReplyLoaded ? (
            <button
              className="text-black/75 p-2 px-3 hover:bg-rose-quartz/10 hover:text-french-gray duration-300 rounded-md flex items-center gap-2"
              onClick={handleHideReplies}
            >
              Hide Reply
            </button>
          ) : (
            <button
              className="text-black bg-grey/80 p-2 px-3 hover:bg-rose-quartz/20 rounded-md flex items-center gap-2 duration-300"
              onClick={handleLoadReplies}
            >
              {children.length} replies
            </button>
          )}

          <button
            className="underline bg-grey/50 hover:bg-grey text-black outline-none hover:outline-rose-quartz/30 p-2 rounded-md duration-300 hover:text-french-gray"
            onClick={handleReply}
          >
            reply
          </button>

          {username == commented_by_username || username == author_username ? (
            <button
              className="group duration-300 py-2 px-3 rounded-md border border-french-gray/30 ml-auto hover:bg-red/30 flex items-center "
              onClick={handleDeleteComment}
            >
              <i class="fi fi-rs-trash group-hover:text-red text-black duration-300"></i>
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
