"use client";
import { useEffect, useState } from "react";
import AnimationWrapper from "../pageAnimation/AnimationWrapper";
import InPageNavigation from "./InPageNavigation";
import { getLatestBlogs, getTrendingBlogs } from "@/server/fetchBlogs";
import Loader from "../Loader/Loader";
import BlogPostCard from "./BlogPostCard/BlogPostCard";
import MinimalBlogPost from "./BlogPostCard/MinimalBlogPost";

function HomePage() {
  let [blogs, setBlogs] = useState(null);
  let [trendingBlogs, setTrendingBlogs] = useState(null);

  function fetchLatestBlogs() {
    getLatestBlogs()
      .then((data) => {
        setBlogs(data.blogs);
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

  useEffect(() => {
    fetchLatestBlogs();
    fetchTrendingBlogs();
  }, []);

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* latest blogs */}
        <div className="w-full">
          <InPageNavigation
            routes={["home", "trending blogs"]}
            defaultHidden={["trending blogs"]}
          >
            <>
              {blogs == null ? (
                <Loader />
              ) : (
                blogs.map((blog, i) => {
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
                })
              )}
            </>

            {trendingBlogs == null ? (
              <Loader />
            ) : (
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
            )}
          </InPageNavigation>
        </div>

        {/* filters and trending */}
        <div></div>
      </section>
    </AnimationWrapper>
  );
}

export default HomePage;
