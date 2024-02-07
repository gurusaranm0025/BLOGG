import { useContext } from "react";
import { BlogContext } from "../BlogPage/BlogPage";
import { XMarkIcon } from "@heroicons/react/24/outline";
import CommentField from "./CommentField";

// import { getBlogComments } from "@/server/fetchBlogs";

import NoData from "../HomePage/NoData";
import AnimationWrapper from "../pageAnimation/AnimationWrapper";
import CommentCard from "./CommentCard";
import axios from "axios";

export async function fetchComments({
  skip = 0,
  blog_id,
  setParentCommentCountFun,
  comment_array = null,
}) {
  let res;
  //new code
  await axios
    .post(process.env.NEXT_PUBLIC_SERVER_DOMAIN + "/getBlogComments", {
      blog_id,
      skip,
    })
    .then(({ data }) => {
      data.comments.map((comment) => {
        comment.childrenLevel = 0;
      });

      setParentCommentCountFun((preVal) => data.comments.length);

      if (comment_array == null) {
        res = { results: data.comments };
      } else {
        res = { results: [...comment_array, ...data.comments] };
      }
    });

  //old code
  // await getBlogComments({ blog_id, skip }).then((data) => {
  //   data.comments.map((comment) => {
  //     comment.childrenLevel = 0;
  //   });

  //   setParentCommentCountFun((preVal) => data.comments.length);

  //   if (comment_array == null) {
  //     res = { results: data.comments };
  //   } else {
  //     res = { results: [...comment_array, ...data.comments] };
  //   }
  // });

  return res;
}

function CommentsContainer() {
  let {
    blog,
    blog: {
      _id,
      title,
      comments: { results: commentsArr },
      activity: { total_parent_comments },
    },
    setBlog,
    commentsWrapper,
    setCommentsWrapper,
    totalParentCommentsLoaded,
    setTotalParentCommentsLoaded,
  } = useContext(BlogContext);

  async function loadMoreComments(e) {
    let newCommentsArr = await fetchComments({
      skip: totalParentCommentsLoaded,
      blog_id: _id,
      setParentCommentCountFun: setTotalParentCommentsLoaded,
      comment_array: commentsArr,
    });
    console.log(newCommentsArr);

    setBlog({ ...blog, comments: newCommentsArr });
  }

  return (
    <div
      className={
        "max-sm:w-full fixed " +
        (commentsWrapper ? "top-0 sm:right-0" : "top-[100%] sm:right-[-100%]") +
        " duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden"
      }
    >
      <div className="relative">
        <h1 className="text-2xl font-medium">Comments</h1>
        <p className="text-xl mt-2 w-[70%] text-black line-clamp-1">{title}</p>

        <button
          className="absolute top-0 right-0 flex items-center justify-center w-12 h-12 rounded-full outline-none outline-rose-quartz/30 hover:outline-rose-quartz hover:bg-rose-quartz/20 duration-300"
          onClick={() => setCommentsWrapper((curVal) => !curVal)}
        >
          <XMarkIcon className="w-[2rem] absolute" />
        </button>
      </div>
      <hr className="border-french-gray/60  my-8 w-[120%] -ml-10 " />

      <CommentField action={"comment"} />

      {commentsArr && commentsArr.length ? (
        commentsArr.map((comment, i) => {
          return (
            <AnimationWrapper key={i}>
              <CommentCard
                index={i}
                leftVal={comment.childrenLevel}
                commentData={comment}
              />
            </AnimationWrapper>
          );
        })
      ) : (
        <NoData message="No comments" />
      )}

      {total_parent_comments > totalParentCommentsLoaded ? (
        <button
          className="text-cadet-gray p-2 px-3 hover:bg-gray-300/30 rounded-md flex items-center gap-2 duration-200"
          onClick={loadMoreComments}
        >
          Load more
        </button>
      ) : (
        ""
      )}
    </div>
  );
}

export default CommentsContainer;
