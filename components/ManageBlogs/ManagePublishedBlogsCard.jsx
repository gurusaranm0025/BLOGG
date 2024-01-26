"use client";
import { getDay } from "../HomePage/BlogPostCard/date";
import { useContext, useState } from "react";
import { UserContext } from "@/common/ContextProvider";
import { deleteBlog } from "@/server/fetchBlogs";

function BlogStats({ stats }) {
  return (
    <div className="flex min-w-[500px] gap-2 max-lg:mb-6 max-lg:pb-6 border-french-gray/60 max-lg:border-b">
      {Object.keys(stats).map((key, i) => {
        return !key.includes("parent") ? (
          <div
            key={i}
            className={
              "flex flex-col items-center w-full h-full justify-center p-4 px-6 " +
              (i != 0 ? "border-french-gray/60 border-l " : "")
            }
          >
            <h1 className="text-xl lg:text-2xl mb-2">
              {stats[key].toLocaleString()}
            </h1>
            <p className="max-lg:text-gunmetal capitalize">
              {key.split("_")[1]}
            </p>
          </div>
        ) : (
          ""
        );
      })}
    </div>
  );
}

export function ManagePublishedBlogsCard({ blog }) {
  let { banner, blog_id, title, publishedAt, activity } = blog;
  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  let [showStat, setShowStat] = useState(false);

  return (
    <>
      <div className="flex gap-10 border-b mb-6 max-md:px-4 border-french-gray/60 pb-6 items-center">
        <img
          src={banner}
          className="max-md:hidden lg:hidden xl:block w-28 h-28  flex-none bg-cadet-gray/20 object-cover"
          alt="blog-banner"
        />

        <div className="flex flex-col justify-between py-2 w-full min-w-[300px]">
          <div>
            <a
              href={`/blog/${blog_id}`}
              className="blog-title mb-4 hover:underline"
            >
              {title}
            </a>

            <p className="line-clamp-1 ">Published on {getDay(publishedAt)}</p>
          </div>

          <div className="flex gap-6 mt-3 ">
            <a
              href={`/editor/${blog_id}`}
              className="px-4 py-2 underline hover:bg-rose-quartz/10 duration-300 rounded-lg hover:text-black"
            >
              Edit
            </a>

            <button
              className="lg:hidden px-4 py-2 underline hover:bg-rose-quartz/10 rounded-lg hover:text-black duration-300 text-center"
              onClick={() => setShowStat((preVal) => !preVal)}
            >
              Stats
            </button>

            <button
              className="px-4 py-2 underline text-red hover:bg-red/10 duration-300 rounded-lg text-center"
              onClick={(e) =>
                deleteBlogFunc({ access_token, blog, target: e.target })
              }
            >
              Delete
            </button>
          </div>
        </div>

        <div className="max-lg:hidden">
          <BlogStats stats={activity} />
        </div>
      </div>

      <div>
        {showStat ? (
          <div className="lg:hidden">
            <BlogStats stats={activity} />
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export function ManageDraftBlogsCard({ blog }) {
  let { title, des, blog_id, index } = blog;
  index++;

  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  return (
    <div className="flex gap-5 lg:gap-10 pb-6 border-b mb-6 border-french-gray/60">
      <h1 className="blog-index text-center pl-4 md:pl-6 flex-none">
        {index < 10 ? "0" + index : index}
      </h1>

      <div>
        <h1 className="blog-title mb-3">{title}</h1>

        <p>{des.length ? des : "No description."}</p>

        <div className="flex gap-6 mt-3">
          <a href={`/editor/${blog_id}`} className="pr-4 py-2 underline">
            Edit
          </a>

          <button
            className="pr-4 py-2 underline text-red"
            onClick={(e) =>
              deleteBlogFunc({ access_token, blog, target: e.target })
            }
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function deleteBlogFunc({ blog, access_token, target }) {
  let { index, blog_id, setStateFunc } = blog;

  target.setAttribute("disabled", true);

  deleteBlog({ token: access_token, blog_id })
    .then((data) => {
      target.removeAttribute("disabled");

      setStateFunc((preVal) => {
        let { deletedDocCount, totalDocs, results } = preVal;

        if (!deletedDocCount) {
          deletedDocCount = 0;
        }

        results.splice(index, 1);

        if (!results.length && totalDocs - 1 > 0) {
          return null;
        }

        return {
          ...preVal,
          totalDocs: totalDocs - 1,
          deletedDocCount: deletedDocCount + 1,
        };
      });
    })
    .catch((err) => {
      console.error(err.message);
    });
}
