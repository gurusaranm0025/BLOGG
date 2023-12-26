"use client";
import { useState } from "react";

function CommentField({ action }) {
  const [comment, setComment] = useState("");
  return (
    <>
      <textarea
        value={comment}
        placeholder="Leave a comment"
        onChange={(e) => setComment(e.target.value)}
        className="input-box outline-none focus:outline-french-gray duration-300 pl-5 placeholder:text-cadet-gray resize-none h-[150px] overflow-auto"
      ></textarea>
      <button className="btn-dark mt-5 px-10 capitalize">{action}</button>
    </>
  );
}

export default CommentField;
import React from "react";
