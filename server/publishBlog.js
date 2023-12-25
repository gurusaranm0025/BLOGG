"use server";

import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import mongoose from "mongoose";

//schema
import Blog from "@/Schema/Blog.js";
import User from "@/Schema/User.js";

mongoose.connect(process.env.DB_LOCATION, {
  autoIndex: true,
});

export async function createBlog(token, blogContent) {
  if (token == null) {
    return {
      status: 500,
      message: "Access denied. try signing in again with your account.",
    };
  }

  let authorId = null;

  const tokenResult = jwt.verify(
    token,
    process.env.SECRET_ACCESS_KEY,
    (err, user) => {
      if (err) {
        return {
          status: 500,
          message: "Access token is invalid",
          error: err.message,
        };
      }
      return { status: 200, message: "Token is valid", id: user.id };
    }
  );

  if ((tokenResult.status = 200)) {
    authorId = tokenResult.id;
  } else {
    console.log(tokenResult);
    return tokenResult;
  }

  let { title, des, banner, tags, content, draft, id } = blogContent;

  if (!title.length)
    return {
      status: 500,
      message: "Give a title to upload.",
      error: "you should give a title to publish your blog.",
    };

  if (!draft) {
    if (!des.length || des.length > 200)
      return {
        status: 500,
        message:
          "You must provide a blog description which is less than 200 characters",
        error:
          "You must give your blog a description and it should contain less than 200 characters.",
      };

    if (!banner.length)
      return {
        status: 500,
        message: "You must provide a blog banner to continue",
        error: "You must give your blog a banner image to publish it.",
      };

    if (!content.blocks.length)
      return {
        status: 500,
        message: "There are no content in the blog to publish it.",
        error:
          "You must write something in your blog to publish it, we can't just allow you to publish nothing now, right!",
      };

    if (!tags.length || tags.length > 10)
      return {
        status: 500,
        message: "Please provide tags (maximum 10 tags are allowed)",
        error:
          "Give your blog some tags, which helps us to optimize search results to show your blog in searches.",
      };
  }

  tags = tags.map((tag) => tag.toLowerCase());

  let blog_id =
    id ||
    title
      .replace(/[^a-zA-Z0-9]/g, " ")
      .replace(/\s+/g, "-")
      .trim() + nanoid();

  if (id) {
    const blogUpdateResult = await Blog.findOneAndUpdate(
      { blog_id },
      { title, des, banner, content, tags, draft: Boolean(draft) }
    )
      .then((data) => {
        return { status: 200, id: data.blog_id };
      })
      .catch((err) => {
        return {
          status: 500,
          message: "Failed to update the blog.",
          error: err.message,
        };
      });

    return blogUpdateResult;
  } else {
    let blog = new Blog({
      title,
      des,
      banner,
      content,
      tags,
      author: authorId,
      blog_id,
      draft: Boolean(draft),
    });

    const blogPublishResult = await blog
      .save()
      .then(async (blog) => {
        let incrementVal = draft ? 0 : 1;
        const findUpdateResult = await User.findOneAndUpdate(
          { _id: authorId },
          {
            $inc: { "account_info.total_posts": incrementVal },
            $push: { blogs: blog._id },
          }
        )
          .then((user) => {
            return { status: 200, message: blog.blog_id };
          })
          .catch((err) => {
            console.log(err.message);
            return {
              status: 500,
              message: "Failed to update total number of posts",
              error: err.message,
            };
          });

        return findUpdateResult;
      })
      .catch((err) => {
        console.log(err.message);
        return {
          status: 500,
          message: "Failed to publish blog",
          error: err.message,
        };
      });

    blogPublishResult.status == 500 ? console.log(blogPublishResult) : "";
    return blogPublishResult;
  }
}
