import { UserContext } from "@/common/ContextProvider";
import { addComment } from "@/server/fetchBlogs";
import { useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function NotificationCommentField({
  _id,
  blog_author,
  index = undefined,
  replyingTo = undefined,
  setReplying,
  notification_id,
  notificationData,
}) {
  let [comment, setComment] = useState("");

  let { _id: user_id } = blog_author;

  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  let {
    notifications,
    notifications: { results },
    setNotifications,
  } = notificationData;

  function handleComments() {
    if (!comment.length) {
      return toast.error("Write something to comment.");
    }

    addComment({
      token: access_token,
      _id,
      blog_author: user_id,
      comment,
      replying_to: replyingTo,
    })
      .then((response) => {
        setReplying(false);

        results[index].reply = { comment, _id: response._id };

        setNotifications({ ...notifications, results });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  return (
    <>
      <Toaster />
      <textarea
        value={comment}
        placeholder="Leave a reply..."
        onChange={(e) => setComment(e.target.value)}
        className="input-box bg-gray-300/50 focus:bg-white outline-none focus:outline-french-gray duration-300 pl-5 placeholder:text-cadet-gray resize-none h-[150px] overflow-auto"
      ></textarea>
      <button
        onClick={handleComments}
        className="btn-dark mt-5 px-10 capitalize"
      >
        Reply
      </button>
    </>
  );
}

export default NotificationCommentField;
