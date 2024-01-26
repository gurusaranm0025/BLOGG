import { getDay } from "../HomePage/BlogPostCard/date";
import { useContext, useState } from "react";
import NotificationCommentField from "./NotificationCommentField";
import { UserContext } from "@/common/ContextProvider";
import { deleteComment } from "@/server/fetchBlogs";

function NotificationCard({ data, index, notificationState }) {
  let [isReplying, setIsReplying] = useState(false);
  let {
    type,
    reply,
    comment,
    replied_on_comment,
    user,
    user: {
      personal_info: { profile_img, fullname, username },
    },
    blog: { _id, blog_id, title },
    createdAt,
    _id: notification_id,
  } = data;

  let {
    userAuth: {
      username: author_username,
      profile_img: author_profile_img,
      access_token,
    },
  } = useContext(UserContext);

  let {
    notifications,
    notifications: { results, totalDocs },
    setNotifications,
  } = notificationState;

  function handleReplyClick() {
    setIsReplying((preValue) => !preValue);
  }

  function handleDelete(comment_id, type, target) {
    target.setAttribute("disabled", true);

    deleteComment({ token: access_token, _id: comment_id })
      .then(() => {
        if (type == "comment") {
          results.splice(index, 1);
        } else {
          delete results[index].reply;
        }

        target.removeAttribute("disabled");
        setNotifications({
          ...notifications,
          results,
          totalDocs: totalDocs - 1,
          deleteDocCount: notifications.deleteDocCount + 1,
        });
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

  return (
    <div className="p-6 border-b border-french-gray/60 border-l-black/60">
      <div className="flex gap-5 mb-3">
        <img
          src={profile_img}
          className="h-14 w-14 flex-none rounded-full"
          alt="profile-image"
        />
        <div className="w-full">
          <h1 className="font-medium text-xl text-gunmetal">
            <span className="lg:inline-block hidden capitalize">
              {fullname}
            </span>
            <a
              href={`/user/${username}`}
              className="mx-1 text-black underline text-lg"
            >
              @{username}
            </a>
            <span className="font-normal text-sm">
              {type == "like"
                ? "liked your blog"
                : type == "comment"
                ? "commented on"
                : "replied on"}
            </span>
          </h1>

          {type == "reply" ? (
            <div className="p-4 mt-4 rounded-md bg-gray-200">
              <p>{replied_on_comment.comment}</p>
            </div>
          ) : (
            <a
              href={`/blog/${blog_id}`}
              className="font-medium text-dark-grey hover:underline line-clamp-1"
            >{`"${title}"`}</a>
          )}
        </div>
      </div>

      {type != "like" ? (
        <p className="ml-14 pl-5 font-noto text-xl my-5">{comment.comment}</p>
      ) : (
        ""
      )}

      <div className="ml-14 pl-5 mt-3 text-cadet-gray/80 flex gap-8">
        <p>{getDay(createdAt)}</p>
        {type != "like" ? (
          <>
            {!reply ? (
              <button
                className="underline hover:text-black"
                onClick={handleReplyClick}
              >
                reply
              </button>
            ) : (
              ""
            )}
            <button
              className="underline hover:text-red"
              onClick={(e) => handleDelete(comment._id, "comment", e.target)}
            >
              delete
            </button>
          </>
        ) : (
          ""
        )}
      </div>

      {isReplying ? (
        <div className="mt-8">
          <NotificationCommentField
            _id={_id}
            blog_author={user}
            index={index}
            replyingTo={comment._id}
            setReplying={setIsReplying}
            notification_id={notification_id}
            notificationData={notificationState}
          />
        </div>
      ) : (
        ""
      )}

      {reply ? (
        <div className="ml-20 p-5 bg-grey/30 rounded-md mt-5 ">
          <div className="flex gap-3 mb-3">
            <img
              src={author_profile_img}
              className="w-8 h-8 rounded-full"
              alt="profile-image"
            />

            <div>
              <h1 className="font-medium text-xl text-cadet-gray link">
                <a
                  className="mx-1 text-black underline"
                  href={`/user/${author_username}`}
                >
                  @{author_username}
                </a>

                <span className="font-normal">replied to</span>

                <a
                  className="mx-1 text-black underline"
                  href={`/user/${username}`}
                >
                  @{username}
                </a>
              </h1>
            </div>
          </div>

          <p className="ml-14 font-noto text-xl my-2">{reply.comment}</p>

          <button
            className="underline hover:text-red ml-14 mt-2"
            onClick={(e) => handleDelete(comment._id, "reply", e.target)}
          >
            delete
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default NotificationCard;
