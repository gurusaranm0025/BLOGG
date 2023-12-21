import AnimationWrapper from "../pageAnimation/AnimationWrapper";
import InPageNavigation from "./InPageNavigation";

function HomePage() {
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
