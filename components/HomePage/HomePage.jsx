"use client";
import { useEffect, useState } from "react";
import AnimationWrapper from "../pageAnimation/AnimationWrapper";
import InPageNavigation from "./InPageNavigation";
import { getLatestBlogs, getTrendingBlogs } from "@/server/fetchBlogs";
import Loader from "../Loader/Loader";
import BlogPostCard from "./BlogPostCard/BlogPostCard";
import MinimalBlogPost from "./BlogPostCard/MinimalBlogPost";
import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";
import { activeTabRef } from "./InPageNavigation";
import { searchBlogs } from "@/server/fetchBlogs";
import NoData from "./NoData";
import { filterPaginationData } from "./FilterPagination";
import LoadMoreDataBtn from "./LoadMoreDataBtn";

function HomePage() {
  let [blogs, setBlogs] = useState(null);
  let [trendingBlogs, setTrendingBlogs] = useState(null);
  let [pageState, setPageState] = useState("home");

  let categories = [
    "programming",
    "hollywood",
    "social media",
    "cooking",
    "film making",
    "tech",
    "finances",
    "travel",
    "life",
    "journey",
    "exploring",
  ];

  function fetchLatestBlogs({ page = 1 }) {
    getLatestBlogs(page)
      .then(async (data) => {
        let formatData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          route: "latest",
          page,
        });

        setBlogs(formatData);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  function fetchTrendingBlogs() {
    getTrendingBlogs()
      .then((data) => {
        setTrendingBlogs(data.blogs);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  function fetchBlogsByCategory({ page = 1 }) {
    searchBlogs({ tag: pageState, page })
      .then(async (data) => {
        if (data.status == 200) {
          let formatData = await filterPaginationData({
            state: blogs,
            data: data.blogs,
            route: "category",
            dataToSend: { tag: pageState },
            page,
          });
          setBlogs(formatData);
        } else {
          console.log(data.error);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  useEffect(() => {
    activeTabRef.current.click();

    if (pageState == "home") {
      fetchLatestBlogs({ page: 1 });
    } else {
      fetchBlogsByCategory({ page: 1 });
    }

    if (trendingBlogs == null) {
      fetchTrendingBlogs();
    }
  }, [pageState]);

  function loadBlogByCategory(e) {
    let category = e.target.innerText.toLowerCase();

    setBlogs(null);

    if (pageState == category) {
      setPageState("home");
      return;
    }

    setPageState(category);
  }

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* latest blogs */}
        <div className="w-full">
          <InPageNavigation
            routes={[pageState, "trending blogs"]}
            defaultHidden={["trending blogs"]}
          >
            <>
              {blogs == null ? (
                <Loader />
              ) : blogs.results.length ? (
                <>
                  {blogs.results.map((blog, i) => {
                    return (
                      <AnimationWrapper
                        key={i}
                        transition={{ duration: 1, delay: i * 0.1 }}
                      >
                        <BlogPostCard
                          content={blog}
                          author={blog.author.personal_info}
                        />
                      </AnimationWrapper>
                    );
                  })}
                  <LoadMoreDataBtn
                    state={blogs}
                    fetchDataFun={
                      pageState == "home"
                        ? fetchLatestBlogs
                        : fetchBlogsByCategory
                    }
                  />
                </>
              ) : (
                <NoData message="No blogs have been published under this category" />
              )}
            </>

            {trendingBlogs == null ? (
              <Loader />
            ) : trendingBlogs.length ? (
              trendingBlogs.map((blog, i) => {
                return (
                  <AnimationWrapper
                    key={i}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  >
                    <MinimalBlogPost blog={blog} index={i} />
                  </AnimationWrapper>
                );
              })
            ) : (
              <NoData message="No trending blogs" />
            )}
          </InPageNavigation>
        </div>

        {/* filters and trending */}
        <div className="min-w-[40%] lg:min-w-[400px] border-l border-gray-300 pl-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10">
            <div>
              <h1 className="font-medium text-xl mb-8">
                Stories from all interests
              </h1>

              <div className="flex flex-wrap gap-3">
                {categories.map((category, i) => {
                  return (
                    <button
                      className={
                        "capitalize Tag duration-200 " +
                        (pageState == category
                          ? " bg-gunmetal text-white "
                          : "")
                      }
                      key={i}
                      onClick={loadBlogByCategory}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h1 className="font-medium text-xl mb-8">
                Trending
                <ArrowTrendingUpIcon className="w-[1.5rem] inline-block" />
              </h1>

              {trendingBlogs == null ? (
                <Loader />
              ) : trendingBlogs.length ? (
                trendingBlogs.map((blog, i) => {
                  return (
                    <AnimationWrapper
                      key={i}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    >
                      <MinimalBlogPost blog={blog} index={i} />
                    </AnimationWrapper>
                  );
                })
              ) : (
                <NoData message="No trending blogs" />
              )}
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
}

export default HomePage;
