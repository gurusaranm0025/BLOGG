function LoadMoreDataBtn({ state, fetchDataFun, additionalParam }) {
  if (state != null && state.totalDocs > state.results.length) {
    return (
      <button
        className="text-cadet-gray p-2 px-3 hover:border-french-gray/30 rounded-md flex gap-2 items-center"
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
