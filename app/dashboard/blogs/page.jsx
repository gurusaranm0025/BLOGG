"use client";
import { UserContext } from "@/common/ContextProvider";
import { filterPaginationData } from "@/components/HomePage/FilterPagination";
import InPageNavigation from "@/components/HomePage/InPageNavigation";
import LoadMoreDataBtn from "@/components/HomePage/LoadMoreDataBtn";
import NoData from "@/components/HomePage/NoData";
import Loader from "@/components/Loader/Loader";
import {
  ManageDraftBlogsCard,
  ManagePublishedBlogsCard,
} from "@/components/ManageBlogs/ManagePublishedBlogsCard";
import AnimationWrapper from "@/components/pageAnimation/AnimationWrapper";
import { getUserWrittenBlogs } from "@/server/fetchBlogs";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

function page() {
  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  const [blogs, setBlogs] = useState(null);
  const [drafts, setDrafts] = useState(null);
  const [query, setQuery] = useState("");

  // let activeTab = useSearchParams()[0].get("tab");
  const searchParams = useSearchParams();
  let activeTab = searchParams.get("tab");
  console.log("active Tab : ", activeTab);

  function getBlogs({ page, draft, deletedDocCount = 0 }) {
    getUserWrittenBlogs({
      token: access_token,
      query,
      page,
      draft,
      deletedDocCount,
    })
      .then(async (data) => {
        let formattedData = await filterPaginationData({
          state: draft ? drafts : blogs,
          data: data.blogs,
          page,
          route: "user-written-blogs-count",
          dataToSend: { user: access_token, draft, query },
        });

        console.log("draft => " + draft, formattedData);

        if (draft) {
          setDrafts(formattedData);
        } else {
          setBlogs(formattedData);
        }
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

  useEffect(() => {
    if (access_token) {
      if (blogs == null) {
        getBlogs({ page: 1, draft: false });
      }

      if (drafts == null) {
        getBlogs({ page: 1, draft: true });
      }
    }
  }, [access_token, blogs, drafts, query]);

  function handleChange(e) {
    if (!e.target.value.length) {
      setQuery("");
      setBlogs(null);
      setDrafts(null);
    }
  }

  function handleKeyDown(e) {
    let searchQuery = e.target.value;

    setQuery(searchQuery);

    if (e.keyCode == 13 && searchQuery.length) {
      setBlogs(null);
      setDrafts(null);
    }
  }

  return (
    <>
      <h1 className="max-md:hidden">Manage Blogs</h1>

      <Toaster />

      <div className="relative max-md:mt-5 md:mt-8 mb-10">
        <input
          type="search"
          placeholder="Search Blogs..."
          className="w-full bg-gray-200 p-4 pl-12 pr-6 rounded-full outline-none focus:outline-french-gray hover:bg-cadet-gray border-none placeholder:text-cadet-gray duration-300 hover:placeholder:text-gray-200 focus:bg-french-gray"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        <i className="fa-solid fa-magnifying-glass absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-gunmetal"></i>
      </div>

      <InPageNavigation
        routes={["Published Blogs", "Drafts"]}
        defaultActiveIndex={activeTab != "draft" ? 0 : 1}
      >
        {/* Published blogs */}

        {blogs == null ? (
          <Loader />
        ) : blogs.results.length ? (
          <>
            {blogs.results.map((blog, i) => {
              return (
                <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                  <ManagePublishedBlogsCard
                    blog={{ ...blog, index: i, setStateFunc: setBlogs }}
                  />
                </AnimationWrapper>
              );
            })}

            <LoadMoreDataBtn
              state={blogs}
              fetchDataFun={getBlogs}
              additionalParam={{
                draft: false,
                deletedDocCount: blogs.deletedDocCount,
              }}
            />
          </>
        ) : (
          <NoData message={"No published blogs"} />
        )}

        {/* Drafted blogs */}
        {drafts == null ? (
          <Loader />
        ) : drafts.results.length ? (
          <>
            {drafts.results.map((blog, i) => {
              return (
                <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                  <ManageDraftBlogsCard
                    blog={{ ...blog, index: i, setStateFunc: setDrafts }}
                  />
                </AnimationWrapper>
              );
            })}

            <LoadMoreDataBtn
              state={drafts}
              fetchDataFun={getBlogs}
              additionalParam={{
                draft: true,
                deletedDocCount: drafts.deletedDocCount,
              }}
            />
          </>
        ) : (
          <NoData message={"No published blogs"} />
        )}
      </InPageNavigation>
    </>
  );
}

export default page;
