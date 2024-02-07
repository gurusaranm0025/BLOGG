"use client";
import NotFound from "@/app/not-found";
import { UserContext } from "@/common/ContextProvider";
import AboutUser from "@/components/About/AboutUser";
import BlogPostCard from "@/components/HomePage/BlogPostCard/BlogPostCard";
import { filterPaginationData } from "@/components/HomePage/FilterPagination";
import InPageNavigation from "@/components/HomePage/InPageNavigation";
import LoadMoreDataBtn from "@/components/HomePage/LoadMoreDataBtn";
import NoData from "@/components/HomePage/NoData";
import Loader from "@/components/Loader/Loader";
import AnimationWrapper from "@/components/pageAnimation/AnimationWrapper";

// import { getUserProfile, searchBlogs } from "@/server/fetchBlogs";
import axios from "axios";

import { useContext, useEffect, useState } from "react";

export const profileDataStructure = {
  personal_info: {
    fullname: "",
    username: "",
    profile_img: "",
    bio: "",
  },
  account_info: {
    total_posts: 0,
    total_reads: 0,
  },
  social_links: {},
  joinedAt: "",
};

function UserIdPage({ params }) {
  let { id: profileId } = params;

  let [profile, setProfile] = useState(profileDataStructure);
  let [loading, setLoading] = useState(true);
  let [blogs, setBlogs] = useState(null);
  let [profileLoaded, setProfileLoaded] = useState("");

  let {
    userAuth: { username },
  } = useContext(UserContext);

  let {
    personal_info: { fullname, username: profileUsername, profile_img, bio },
    account_info: { total_posts, total_reads },
    social_links,
    joinedAt,
  } = profile;

  function fetchUserProfile() {
    //new code
    axios
      .post(process.env.NEXT_PUBLIC_SERVER_DOMAIN + "/getUserProfile", {
        username: profileId,
      })
      .then(({ data }) => {
        if (data.user != null) {
          setProfile(data.user);
          getBlogs({ createNewArr: true, user_id: data.user._id });
        }
        setProfileLoaded(profileId);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
      });

    //old code
    // getUserProfile({ username: profileId })
    //   .then((data) => {
    //     if (data.user != null) {
    //       setProfile(data.user);
    //       getBlogs({ createNewArr: true, user_id: data.user._id });
    //     }
    //     setProfileLoaded(profileId);
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     console.log(err.message);
    //   });
  }

  function getBlogs({ page = 1, user_id }) {
    user_id = user_id == undefined ? blogs.user_id : user_id;
    //new code
    axios
      .post(process.env.NEXT_PUBLIC_SERVER_DOMAIN + "/searchBlogs", {
        author: user_id,
        page: page,
      })
      .then(async ({ data }) => {
        let formatData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page: page,
          route: "author",
          dataToSend: { author: user_id },
        });

        formatData.user_id = user_id;
        setBlogs(formatData);
      });

    //old code
    // searchBlogs({ author: user_id, page: page }).then(async (data) => {
    //   let formatData = await filterPaginationData({
    //     state: blogs,
    //     data: data.blogs,
    //     page: page,
    //     route: "author",
    //     dataToSend: { author: user_id },
    //   });

    //   formatData.user_id = user_id;
    //   setBlogs(formatData);
    // });
  }

  useEffect(() => {
    if (profileId != profileLoaded) {
      setBlogs(null);
    }
    if (blogs == null) {
      resetStates();
      fetchUserProfile();
    }
  }, [profileId, blogs]);

  function resetStates() {
    setProfile(profileDataStructure);
    setLoading(true);
    setBlogs(null);
    setProfileLoaded("");
  }

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : profileUsername.length ? (
        <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
          <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-cadet-gray/50 md:sticky md:top-[100px] md:py-10">
            <img
              className="w-48 h-48 bg-gray-300 rounded-full md:w-32 md:h-32"
              src={profile_img}
              alt="profile-img"
            />
            <h1 className="text-xl font-medium font-montserrat">
              @{profileUsername}
            </h1>
            <p className="capitalize text-lg h-6 font-poppins">{fullname}</p>

            <p>
              {total_posts.toLocaleString()} blogs -{" "}
              {total_reads.toLocaleString()} reads
            </p>

            <div className="flex gap-4 mt-2 ">
              {profileId == username ? (
                <a
                  href={"/settings/edit-profile"}
                  className="btn-light rounded-md"
                >
                  Edit Profile
                </a>
              ) : (
                ""
              )}
            </div>

            <AboutUser
              className="max-md:hidden"
              bio={bio}
              social_links={social_links}
              joinedAt={joinedAt}
            />
          </div>

          <div className="max-md:mt-12 w-full">
            <InPageNavigation
              routes={["Blogs Published", "About"]}
              defaultHidden={["About"]}
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
                          fetchDataFun={getBlogs}
                        />
                      </AnimationWrapper>
                    );
                  })
                ) : (
                  <NoData message="No blogs have been published under this category" />
                )}
              </>

              <AboutUser
                bio={bio}
                social_links={social_links}
                joinedAt={joinedAt}
              />
            </InPageNavigation>
          </div>
        </section>
      ) : (
        <NotFound />
      )}
    </AnimationWrapper>
  );
}

export default UserIdPage;
