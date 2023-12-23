"use server";
import mongoose from "mongoose";

//schema
import User from "@/Schema/User";
import Blog from "@/Schema/Blog";
import { resolve } from "styled-jsx/css";

mongoose.connect(process.env.DB_LOCATION, { autoIndex: true });

//function to get latest blogs from DB
export async function getLatestBlogs(page = 1) {
  let maxLimit = 5;

  const result = await Blog.find({ draft: false })
    .populate(
      "author",
      "personal_info.profile_img personal_info.fullname personal_info.username -_id"
    )
    .lean()
    .sort({ publishedAt: -1 })
    .select("blog_id title des banner tags activity publishedAt -_id")
    .skip(maxLimit * (page - 1))
    .limit(maxLimit)
    .then((blogs) => {
      return { status: 200, blogs: blogs };
    })
    .catch((err) => {
      return {
        status: 500,
        message: "Can't connect to the server",
        error: err.message,
      };
    });

  return result;
}

//latest blogs count
export async function blogsCount({ route, category }) {
  let findQuery;
  if (route == "latest") {
    findQuery = { draft: false };
  } else if (route == "category") {
    findQuery = { draft: false, tags: category.tag };
  } else if (route == "searchByQuery") {
    findQuery = { draft: false, title: new RegExp(category.query, "i") };
  }

  let result = await Blog.countDocuments(findQuery)
    .then((count) => {
      return { status: 200, totalDocs: count };
    })
    .catch((err) => {
      return {
        status: 500,
        message: "CAn't connect to the server",
        error: err.message,
      };
    });

  return result;
}

//function to get trending blogs
export async function getTrendingBlogs() {
  const result = await Blog.find({ draft: false })
    .populate(
      "author",
      "personal_info.profile_img personal_info.fullname personal_info.username -_id"
    )
    .lean()
    .sort({
      "activity.total_reads": -1,
      "activity.total_likes": -1,
      publishedAt: -1,
    })
    .select("blog_id title publishedAt -_id")
    .limit(5)
    .then((blogs) => {
      return { status: 200, blogs: blogs };
    })
    .catch((err) => {
      return {
        status: 500,
        message: "Can't connect to the server",
        error: err.message,
      };
    });

  return result;
}

//searching blogs
export async function searchBlogs({ query, tag, page = 1 }) {
  let maxLimit = 5;
  let findQuery;

  if (tag) {
    findQuery = { tags: tag, draft: false };
  } else if (query) {
    findQuery = { draft: false, title: new RegExp(query, "i") };
  }

  const result = await Blog.find(findQuery)
    .populate(
      "author",
      "personal_info.profile_img personal_info.fullname personal_info.username -_id"
    )
    .lean()
    .sort({ publishedAt: -1 })
    .select("blog_id title des banner tags activity publishedAt -_id")
    .skip(maxLimit * (page - 1))
    .limit(maxLimit)
    .then((blogs) => {
      return { status: 200, blogs: blogs };
    })
    .catch((err) => {
      return {
        status: 500,
        message: "Can't connect to the server",
        error: err.message,
      };
    });

  return result;
}
