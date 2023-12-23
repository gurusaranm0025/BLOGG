"use client";
import { useEffect } from "react";
import AnimationWrapper from "../pageAnimation/AnimationWrapper";
import InPageNavigation from "./InPageNavigation";
import { getLatestBlogs } from "@/server/latestBlogs";

function HomePage() {
  function fetchLatestBlogs() {
    const result = getLatestBlogs();

    console.log(result);
  }

  useEffect(() => {
    fetchLatestBlogs();
  }, []);

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* latest blogs */}
        <div className="w-full">
          <InPageNavigation
            routes={["home", "trending blogs"]}
            defaultHidden={["trending blogs"]}
          ></InPageNavigation>
        </div>

        {/* filters and trending */}
        <div></div>
      </section>
    </AnimationWrapper>
  );
}

export default HomePage;
