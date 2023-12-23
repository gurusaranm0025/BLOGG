import { HeartIcon } from "@heroicons/react/24/outline";
import { getDay } from "./date";
import Link from "next/link";

function BlogPostCard({ content, author }) {
  let {
    blog_id: id,
    title,
    banner,
    publishedAt,
    tags,
    des,
    activity: { total_likes },
  } = content;
  let { profile_img, username, fullname } = author;

  return (
    <Link
      href={`/blog/${id}`}
      className="flex gap-8 items-center border-b border-french-gray pb-5 mb-4"
    >
      <div className="w-full ">
        <div className="flex gap-2 items-center mb-7">
          <img
            src={profile_img}
            alt="author-profile-img"
            className="h-6 w-6 rounded-full"
          />
          <p className="line-clamp-1 font-normal">
            {fullname} @{username}
          </p>
          <p className="min-w-fit">{getDay(publishedAt)}</p>
        </div>

        <h1 className="blog-title">{title}</h1>
        <p className="text-lg font-noto my-3 leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2">
          {des}
        </p>

        <div className="flex gap-4 mt-7">
          <span className="btn-light py-1 px-4">{tags[0]}</span>
          <span className="flex items-center gap-2">
            <HeartIcon className="w-[1.1rem] ml-3 text-cadet-gray" />
            {total_likes}
          </span>
        </div>
      </div>

      <div className="h-28 aspect-square bg-gray-300">
        <img
          src={banner}
          alt="blog-banner"
          className="w-full h-full aspect-square object-cover"
        />
      </div>
    </Link>
  );
}

export default BlogPostCard;
