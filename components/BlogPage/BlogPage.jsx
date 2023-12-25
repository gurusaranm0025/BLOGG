"use client";
import { getBlog, searchBlogs } from "@/server/fetchBlogs";
import { createContext, useEffect, useState } from "react";
import AnimationWrapper from "../pageAnimation/AnimationWrapper";
import Loader from "../Loader/Loader";
import Link from "next/link";
import { getDay } from "../HomePage/BlogPostCard/date";
import BlogInteraction from "./BlogInteraction";
import BlogPostCard from "../HomePage/BlogPostCard/BlogPostCard";
import BlogContent from "./BlogContent";

export const blogStructure = {
  title: "",
  des: "",
  content: [],
  banner: "",
  author: {
    personal_info: {},
  },
  publishedAt: "",
  tags: [],
};

export const BlogContext = createContext({});

function BlogPage({ blogId }) {
  const [blog, setBlog] = useState(blogStructure);
  const [loading, setLoading] = useState(true);
  const [similarBlogs, setSimilarBlogs] = useState(null);

  let {
    title,
    des,
    content,
    banner,
    author: {
      personal_info: { username: authorUsername, fullname, profile_img },
    },
    publishedAt,
  } = blog;

  function fetchBlog() {
    getBlog({ blog_id: blogId })
      .then((data) => {
        setBlog(data.blog);
        setLoading(false);
        searchBlogs({
          tag: blog.tags[0],
          limit: 6,
          eliminate_blog: data.blog_id,
        })
          .then((response) => {
            console.log(response.blogs);
            setSimilarBlogs(response.blogs);
          })
          .catch((err) => {
            console.log(err.message);
          });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  useEffect(() => {
    resetStates();
    fetchBlog();
  }, [blogId]);

  function resetStates() {
    setBlog(blogStructure);
    setLoading(true);
    setSimilarBlogs(null);
  }

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : (
        <BlogContext.Provider value={{ blog, setBlog }}>
          <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
            <img src={banner} className="aspect-video" alt="banner-image" />

            <div className="mt-12 ">
              <h2>{title}</h2>

              <div className="flex max-sm:flex-col justify-between my-8 ">
                <div className="flex gap-5 items-start">
                  <img
                    src={profile_img}
                    className="w-12 h-12 rounded-full"
                    alt="profile-image"
                  />
                  <p className="capitalize">
                    {fullname} <br />@
                    <Link
                      href={`/user/${authorUsername}`}
                      className="underline"
                    >
                      {authorUsername}
                    </Link>
                  </p>
                </div>

                <p className="text-cadet-gray opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
                  Published on {getDay(publishedAt)}
                </p>
              </div>
            </div>

            <BlogInteraction />

            <div className="my-12 font-noto blog-page-content">
              {content[0].blocks.map((block, i) => {
                return (
                  <div className="my-4 md:my-8">
                    <BlogContent block={block} />
                  </div>
                );
              })}
            </div>

            <BlogInteraction />

            {similarBlogs != null && similarBlogs.length ? (
              <>
                <h1 className="text-2xl mt-14 mb-10 font-medium">
                  Similar blogs...
                </h1>

                {similarBlogs.map((Blog, i) => {
                  let {
                    author: { personal_info },
                  } = Blog;

                  return (
                    <AnimationWrapper
                      key={i}
                      transition={{ duration: 1, delay: i * 0.08 }}
                    >
                      <BlogPostCard content={Blog} author={personal_info} />
                    </AnimationWrapper>
                  );
                })}
              </>
            ) : (
              ""
            )}
          </div>
        </BlogContext.Provider>
      )}
    </AnimationWrapper>
  );
}

export default BlogPage;
