"use client";

import { UserContext } from "@/common/ContextProvider";
import { filterPaginationData } from "@/components/HomePage/FilterPagination";
import LoadMoreDataBtn from "@/components/HomePage/LoadMoreDataBtn";
import NoData from "@/components/HomePage/NoData";
import Loader from "@/components/Loader/Loader";
import NotificationCard from "@/components/Notifications/NotificationCard";
import AnimationWrapper from "@/components/pageAnimation/AnimationWrapper";
import { getNotifications } from "@/server/fetchBlogs";
import { useContext, useEffect, useState } from "react";

function page() {
  const [filter, setFilter] = useState("all");

  const {
    userAuth: { access_token },
  } = useContext(UserContext);

  let filters = ["all", "like", "comment", "reply"];
  let [notifications, setNotifications] = useState(null);

  function fetchNotifications({ page, deletedDocCount = 0 }) {
    getNotifications({
      token: access_token,
      page,
      deletedDocCount,
      filter,
    }).then(async ({ notifications: data }) => {
      console.log(data);
      let formatedData = await filterPaginationData({
        state: notifications,
        data,
        page,
        route: "notifications",
        dataToSend: { filter, user: access_token },
      });

      console.log("Formatted data : ", formatedData);

      setNotifications(formatedData);
    });
  }

  useEffect(() => {
    if (access_token) {
      fetchNotifications({ page: 1 });
    }
  }, [access_token, filter]);

  function filterHandler(e) {
    let btn = e.target;

    setFilter(btn.innerHTML);

    setNotifications(null);
  }

  return (
    <div>
      <h1 className="max-md:hidden">Recent Notifications</h1>

      <div className="my-8 flex gap-6">
        {filters.map((filterName, i) => {
          return (
            <button
              key={i}
              className={
                "py-2 " + (filter == filterName ? "btn-dark" : "btn-light")
              }
              onClick={filterHandler}
            >
              {filterName}
            </button>
          );
        })}
      </div>

      {notifications == null ? (
        <Loader />
      ) : (
        <>
          {notifications.results.length ? (
            notifications.results.map((notification, i) => {
              return (
                <AnimationWrapper key={i} transition={{ delay: i * 0.08 }}>
                  <NotificationCard
                    data={notification}
                    index={i}
                    notificationState={{ notifications, setNotifications }}
                  />
                </AnimationWrapper>
              );
            })
          ) : (
            <NoData message={"Nothing available..."} />
          )}

          <LoadMoreDataBtn
            state={notifications}
            fetchDataFun={fetchNotifications}
            additionalParam={{
              deletedDocCount: notifications.deletedDocCount,
            }}
          />
        </>
      )}
    </div>
  );
}

export default page;
