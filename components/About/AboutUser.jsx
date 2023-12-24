import Link from "next/link";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { getFullDate } from "../HomePage/BlogPostCard/date";

function AboutUser({ className, bio, social_links, joinedAt }) {
  const socialLinksImgSrc = {
    youtube: "fa-brands fa-youtube",
    instagram: "fa-brands fa-instagram",
    github: "fa-brands fa-github",
    facebook: "fa-brands fa-facebook",
    twitter: "fa-brands fa-x-twitter",
    website: "",
  };

  return (
    <div className={"md:w-[90%] md:mt-7 " + className}>
      <p className="text-lg leading-7">
        {bio.length ? bio : "nothing to read here"}
      </p>

      <div className="flex gap-x-7 gap-y-2 flex-wrap my-7 items-center text-cadet-gray">
        {Object.keys(social_links).map((key) => {
          let link = social_links[key];

          return link ? (
            <Link href={link} key={key} target="_blank">
              {key != "website" ? (
                <i
                  className={
                    socialLinksImgSrc[key] +
                    " text-xl text-cadet-gray hover:text-black duration-200"
                  }
                ></i>
              ) : key == "website" ? (
                <GlobeAltIcon className="w-[1.9rem] stroke-cadet-gray duration-200 hover:stroke-black" />
              ) : (
                ""
              )}
            </Link>
          ) : (
            ""
          );
        })}
      </div>

      <p className="text-lg leading-7 text-cadet-gray">
        Joined on {getFullDate(joinedAt)}
      </p>
    </div>
  );
}

export default AboutUser;
