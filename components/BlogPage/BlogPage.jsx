"use client";
import { getBlog } from "@/server/fetchBlogs";
import { useEffect, useState } from "react";
import AnimationWrapper from "../pageAnimation/AnimationWrapper";
import Loader from "../Loader/Loader";

export const blogStructure = {
  title: "",
  des: "",
  content: [],
  banner: "",
  author: {
    personal_info: { fullname: "", username: "", profile_img: "" },
  },
  publishedAt: "",
};

function BlogPage({ blogId }) {
  const [blog, setBlog] = useState(blogStructure);
  const [loading, setLoading] = useState(true);

  let {
    title,
    des,
    content,
    banner,
    author: {
      personal_info: { username, fullname, profile_img },
    },
    publishedAt,
  } = blog;

  function fetchBlog() {
    getBlog({ blog_id: blogId })
      .then((data) => {
        setBlog(data.blog);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  useEffect(() => {
    fetchBlog();
  }, []);

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : (
        <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
          <img src={banner} className="aspect-video" alt="banenr-image" />
        </div>
      )}
    </AnimationWrapper>
  );
}

export default BlogPage;
