"use client";
import BlogPostCard from "@/components/HomePage/BlogPostCard/BlogPostCard";
import { filterPaginationData } from "@/components/HomePage/FilterPagination";
import InPageNavigation from "@/components/HomePage/InPageNavigation";
import LoadMoreDataBtn from "@/components/HomePage/LoadMoreDataBtn";
import NoData from "@/components/HomePage/NoData";
import Loader from "@/components/Loader/Loader";
import NavBar from "@/components/NavBar/NavBar";
import UserCard from "@/components/SearchPage/UserCard";
import AnimationWrapper from "@/components/pageAnimation/AnimationWrapper";
import { searchBlogs, searchUsers } from "@/server/fetchBlogs";
import { useEffect, useState } from "react";

function page({ params }) {
  let query = params.searchTag;
  let [blogs, setBlogs] = useState(null);
  let [users, setUsers] = useState(null);

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

  function getUsers() {
    searchUsers({ query })
      .then((data) => {
        if (data.status == 200) {
          setUsers(data.users);
        } else {
          console.error(data.error);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  function resetState() {
    setBlogs(null);
    setUsers(null);
  }

  useEffect(() => {
    resetState();
    searchBlogsByQuery({ page: 1, createNewArr: true });
    getUsers();
  }, []);

  function UserCardWrapper() {
    return (
      <>
        {console.log(users)}
        {users == null ? (
          <Loader />
        ) : users.length ? (
          users.map((user, i) => {
            return (
              <AnimationWrapper
                key={i}
                transition={{ duration: 1, delay: i * 0.08 }}
              >
                <UserCard user={user} />
              </AnimationWrapper>
            );
          })
        ) : (
          <NoData message="No users were found" />
        )}
      </>
    );
  }

  return (
    <>
      {/* <NavBar /> */}

      <section className="flex h-cover justify-center gap-10">
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
                      <LoadMoreDataBtn
                        state={blogs}
                        fetchDataFun={searchBlogsByQuery}
                      />
                    </AnimationWrapper>
                  );
                })
              ) : (
                <NoData message="No blogs have been published under this category" />
              )}
            </>

            <UserCardWrapper />
          </InPageNavigation>
        </div>

        <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-french-gray/60 pl-8 pt-3 max-md:hidden">
          <h1 className="font-medium text-xl mb-8 flex items-center">
            Users related to search
            <i className="fi fi-rr-users-alt text-2xl text-black inline-block ml-[8px]"></i>
          </h1>

          <UserCardWrapper />
        </div>
      </section>
    </>
  );
}

export default page;
