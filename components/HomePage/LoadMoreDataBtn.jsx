function LoadMoreDataBtn({ state, fetchDataFun, additionalParam }) {
  if (state != null && state.totalDocs > state.results.length) {
    return (
      <button
        className="text-dark-grey hover:text-black text-md p-2 px-3 hover:bg-french-gray/30 rounded-full flex gap-2 items-center duration-300"
        onClick={() =>
          fetchDataFun({ ...additionalParam, page: state.page + 1 })
        }
      >
        Load more
      </button>
    );
  }
}

export default LoadMoreDataBtn;
