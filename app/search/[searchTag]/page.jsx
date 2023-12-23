"use client";
import BlogPostCard from "@/components/HomePage/BlogPostCard/BlogPostCard";
import { filterPaginationData } from "@/components/HomePage/FilterPagination";
import InPageNavigation from "@/components/HomePage/InPageNavigation";
import LoadMoreDataBtn from "@/components/HomePage/LoadMoreDataBtn";
import NoData from "@/components/HomePage/NoData";
import Loader from "@/components/Loader/Loader";
import NavBar from "@/components/NavBar/NavBar";
import AnimationWrapper from "@/components/pageAnimation/AnimationWrapper";
import { searchBlogs } from "@/server/fetchBlogs";
import { useEffect, useState } from "react";

function page({ params }) {
  let query = params.searchTag;
  let [blogs, setBlogs] = useState(null);

  function searchBlogsByQuery({ page = 1, createNewArr = false }) {
    searchBlogs({ query: query, page }).then(async (data) => {
      let formatData = await filterPaginationData({
        createNewArr,
        state: blogs,
        data: data.blogs,
        page,
        route: "searchByQuery",
        dataToSend: { query },
      });

      setBlogs(formatData);
    });
  }

  function resetState() {
    setBlogs(null);
  }

  useEffect(() => {
    resetState();
    searchBlogsByQuery({ page: 1, createNewArr: true });
  }, []);

  return (
    <>
      <NavBar />

      <main>
        <section className="h-cover justify-center gap-10">
          <div className="w-full">
            <InPageNavigation
              routes={[`Search results for "${query}"`, "Accounts Matched"]}
              defaultHidden={["Accounts Matched"]}
            >
              <>
                {blogs == null ? (
                  <Loader />
                ) : blogs.results.length ? (
                  blogs.results.map((blog, i) => {
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
                ) : (
                  <NoData message="No blogs have been published under this category" />
                )}
                <LoadMoreDataBtn
                  state={blogs}
                  fetchDataFun={searchBlogsByQuery}
                />
              </>
            </InPageNavigation>
          </div>
        </section>
      </main>
    </>
  );
}

export default page;
