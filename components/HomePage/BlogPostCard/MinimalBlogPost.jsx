import Link from "next/link";
import { getDay } from "./date";

function MinimalBlogPost({ blog, index }) {
  let {
    title,
    blog_id: id,
    author: {
      personal_info: { fullname, username, profile_img },
    },
    publishedAt,
  } = blog;

  return (
    <Link
      href={`/blog/${id}`}
      className="flex gap-5 mb-9 hover:opacity-80 duration-300 border-b border-french-gray/30 pb-3"
    >
      <h1 className="blog-index">{index < 10 ? "0" + (index + 1) : index}</h1>

      <div>
        <div className="flex gap-2 items-center mb-7">
          <img
            src={profile_img}
            alt="author-profile-img"
            className="h-6 w-6 rounded-full"
          />
          <p className="line-clamp-1 sm:text-md md:text-sm font-normal">
            {fullname} @{username}
          </p>
          <p className="min-w-fit sm:text-md md:text-sm">
            {getDay(publishedAt)}
          </p>
        </div>

        <h1 className="blog-title">{title}</h1>
      </div>
    </Link>
  );
}

export default MinimalBlogPost;
