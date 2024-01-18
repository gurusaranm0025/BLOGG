import { blogsCount } from "@/server/fetchBlogs";

export async function filterPaginationData({
  createNewArr = false,
  state,
  data,
  page,
  route,
  dataToSend = {},
}) {
  let obj;

  if (state != null && !createNewArr) {
    obj = { ...state, results: [...state.results, ...data], page: page };
  } else {
    await blogsCount({ route, category: dataToSend })
      .then((response) => {
        if (response.status == 200) {
          obj = { results: data, page: 1, totalDocs: response.totalDocs };
        } else {
          console.log(response.error);
          obj = response;
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  return obj;
}
