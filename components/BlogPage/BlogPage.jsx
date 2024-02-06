"use client";

// import { getBlog, searchBlogs } from "@/server/fetchBlogs";

import { createContext, useEffect, useState } from "react";
import AnimationWrapper from "../pageAnimation/AnimationWrapper";
import Loader from "../Loader/Loader";
import { getDay } from "../HomePage/BlogPostCard/date";
import BlogInteraction from "./BlogInteraction";
import BlogPostCard from "../HomePage/BlogPostCard/BlogPostCard";
import BlogContent from "./BlogContent";
import CommentsContainer, {
  fetchComments,
} from "../Comments/CommentsContainer";
import axios from "axios";

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
  const [isLikedByUser, setIsLikedByUser] = useState(false);
  const [commentsWrapper, setCommentsWrapper] = useState(false);
  const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useState(0);

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
    //new code
    axios
      .post(process.env.NEXT_PUBLIC_SERVER_DOMAIN + "/getBlog", {
        blog_id: blogId,
      })
      .then(async ({ data }) => {
        data.blog.comments = await fetchComments({
          blog_id: data.blog._id,
          setParentCommentCountFun: setTotalParentCommentsLoaded,
        });

        setBlog(data.blog);

        setLoading(false);

        //old code
        // searchBlogs(
        //   {
        //   tag: blog.tags[0],
        //   limit: 6,
        //   eliminate_blog: data.blog_id,
        // }
        // );

        axios
          .post(process.env.NEXT_PUBLIC_SERVER_DOMAIN + "/searchBlogs", {
            tag: blog.tags[0],
            limit: 6,
            eliminate_blog: data.blog_id,
          })
          .then(({ data: response }) => {
            console.log(response.blogs);
            setSimilarBlogs(response.blogs);
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
      });

    //old code
    // getBlog({ blog_id: blogId })
    //   .then(async (data) => {

    // data.blog.comments = await fetchComments({
    //   blog_id: data.blog._id,
    //   setParentCommentCountFun: setTotalParentCommentsLoaded,
    // });

    // setBlog(data.blog);

    // setLoading(false);
    // searchBlogs({
    //   tag: blog.tags[0],
    //   limit: 6,
    //   eliminate_blog: data.blog_id,
    // })
    //   .then((response) => {
    //     console.log(response.blogs);
    //     setSimilarBlogs(response.blogs);
    //   })
    //   .catch((err) => {
    //     console.log(err.message);
    //   });

    //   })
    // .catch((err) => {
    //   console.log(err.message);
    // });
  }

  useEffect(() => {
    resetStates();
    fetchBlog();
  }, [blogId]);

  function resetStates() {
    setBlog(blogStructure);
    setLoading(true);
    setSimilarBlogs(null);
    setIsLikedByUser(false);
    setCommentsWrapper(false);
    setTotalParentCommentsLoaded(0);
  }

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : (
        <BlogContext.Provider
          value={{
            blog,
            setBlog,
            isLikedByUser,
            setIsLikedByUser,
            commentsWrapper,
            setCommentsWrapper,
            totalParentCommentsLoaded,
            setTotalParentCommentsLoaded,
          }}
        >
          <CommentsContainer />

          <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
            <img
              src={banner}
              className="aspect-video rounded-lg"
              alt="banner-image"
            />

            <div className="mt-12 ">
              <h2>{title}</h2>

              <div className="flex max-sm:flex-col justify-between my-8 ">
                <div className="flex gap-5 items-start">
                  <img
                    src={profile_img}
                    className="w-12 h-12 rounded-full"
                    alt="profile-image"
                  />
                  <p className="capitalize text-black">
                    {fullname} <br />@
                    <a
                      href={`/user/${authorUsername}`}
                      className="underline text-black"
                    >
                      {authorUsername}
                    </a>
                  </p>
                </div>

                <p className="text-black opacity-85 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
                  Published on {getDay(publishedAt)}
                </p>
              </div>
            </div>

            <BlogInteraction />

            <div className="my-12 font-noto blog-page-content">
              {content[0].blocks.map((block, i) => {
                return (
                  <div className="my-4 md:my-8">
                    <BlogContent key={i} block={block} />
                  </div>
                );
              })}
            </div>

            <BlogInteraction />

            {similarBlogs != null && similarBlogs.length ? (
              <>
                <h1 className="text-3xl mt-14 mb-10 font-medium">
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
                      <BlogPostCard
                        key={i}
                        content={Blog}
                        author={personal_info}
                      />
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
